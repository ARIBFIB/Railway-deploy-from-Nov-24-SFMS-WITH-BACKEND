import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { JWTRequest } from '../middleware/jwtAuth';

export class DocumentController {
  static getDocuments = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { foundation_id, document_type, status } = req.query;

    // Build query for documents
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (foundation_id || req.user?.foundation_id) {
      query = query.eq('foundation_id', foundation_id || req.user?.foundation_id);
    }
    
    if (document_type) {
      query = query.eq('document_type', document_type);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data: documents, error } = await query;

    if (error) {
      console.error('❌ Error fetching documents:', error);
      throw createError(error.message, 500);
    }

    // Get additional data for each document
    const enrichedDocuments = await Promise.all(
      (documents || []).map(async (doc: any) => {
        // Get foundation name
        const { data: foundation } = await supabase
          .from('foundations')
          .select('name')
          .eq('id', doc.foundation_id)
          .single();

        // Get uploader profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', doc.uploaded_by)
          .single();

        return {
          ...doc,
          foundations: foundation,
          profiles: profile
        };
      })
    );

    return res.json({
      documents: enrichedDocuments,
      total: enrichedDocuments.length,
      authorization_context: {
        user_id: req.user?.user_id,
        foundation_id: req.user?.foundation_id,
        role_id: req.user?.role_id,
        role: req.user?.role
      }
    });
  });

  static getDocumentById = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;

    const { data: document, error } = await supabase
      .from('documents')
      .select(`
        *,
        foundations(name),
        profiles!documents_uploaded_by_fkey(full_name, email),
        document_versions(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw createError('Document not found', 404);
    }

    res.json({ document });
  });

  static uploadDocument = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 Document Upload Request Started');
    console.log('📋 Request Body:', req.body);
    console.log('📋 Request Body Keys:', Object.keys(req.body));
    console.log('📋 Request Body Values:', Object.values(req.body));
    console.log('📁 File Info:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');
    console.log('👤 User Context:', {
      user_id: req.user?.user_id,
      foundation_id: req.user?.foundation_id,
      role: req.user?.role
    });

    const { foundation_id, document_type, notes } = req.body;
    const file = req.file;

    console.log('🔍 Extracted values:', {
      foundation_id,
      document_type,
      notes,
      file_present: !!file
    });

    if (!file) {
      console.error('❌ No file uploaded');
      throw createError('No file uploaded', 400);
    }

    if (!document_type) {
      console.error('❌ Document type is required');
      throw createError('Document type is required', 400);
    }

    if (!foundation_id) {
      console.error('❌ Foundation ID is required');
      throw createError('Foundation ID is required', 400);
    }

    // Check if user has access to the foundation
    const hasAccess = req.user?.foundation_id === foundation_id;
    if (!hasAccess) {
      console.error('❌ Access denied to foundation:', {
        user_foundation_id: req.user?.foundation_id,
        requested_foundation_id: foundation_id
      });
      throw createError('Access denied to this foundation', 403);
    }

    // Allow any document type string - no validation against document_types table
    // This allows users to enter any custom document type
    console.log(`📄 Document type: ${document_type} (custom type allowed)`);

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `documents/${foundation_id}/${fileName}`;

    console.log('📤 Uploading file to Supabase Storage:', {
      fileName,
      filePath,
      contentType: file.mimetype,
      size: file.size
    });

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ File upload failed:', uploadError);
      throw createError(`File upload failed: ${uploadError.message}`, 500);
    }

    console.log('✅ File uploaded successfully to:', filePath);

    // Create document record directly
    console.log('💾 Creating document record');

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        foundation_id: foundation_id,
        document_type: document_type,
        uploaded_by: req.user?.user_id,
        file_name: file.originalname,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.mimetype,
        approval_notes: notes,
        status: 'uploaded'
      })
      .select()
      .single();

    if (documentError) {
      console.error('❌ Document creation failed:', documentError);
      // Clean up uploaded file if document creation fails
      await supabase.storage.from('documents').remove([filePath]);
      throw createError(`Document creation failed: ${documentError.message}`, 400);
    }

    console.log('✅ Document created successfully:', document);

    res.status(201).json({
      message: 'Document uploaded successfully',
      document,
      authorization_context: {
        user_id: req.user?.user_id,
        foundation_id: foundation_id,
        role_id: req.user?.role_id,
        role: req.user?.role
      }
    });
  });

  static updateDocument = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const { status, approval_notes } = req.body;

    const { data: document, error } = await supabase
      .from('documents')
      .update({
        status,
        approval_notes,
        approved_by: status === 'approved' ? req.user?.user_id : null,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.json({
      message: 'Document updated successfully',
      document
    });
  });

  static deleteDocument = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;

    // Get document to find file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError('Document not found', 404);
    }

    // Delete file from storage
    if (document.file_path) {
      await supabase.storage
        .from('documents')
        .remove([document.file_path]);
    }

    // Delete document record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      throw createError(error.message, 400);
    }

    res.json({ message: 'Document deleted successfully' });
  });

  static downloadDocument = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const { purpose } = req.query;
    const versionParam = req.query.version;

    let requestedVersion: number | null = null;
    if (typeof versionParam === 'string' && versionParam.trim().length > 0) {
      const parsed = Number(versionParam);
      if (!Number.isNaN(parsed) && Number.isInteger(parsed) && parsed > 0) {
        requestedVersion = parsed;
      } else {
        throw createError('Invalid version number provided', 400);
      }
    }

    // Get document directly from documents table
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (documentError || !document) {
      throw createError('Document not found', 404);
    }

    // Check if user has access to this document
    const hasAccess = req.user?.foundation_id === document.foundation_id;
    if (!hasAccess) {
      throw createError('Access denied to this document', 403);
    }

    let filePath = document.file_path;
    let fileName = document.file_name;
    let mimeType = document.mime_type;

    if (requestedVersion !== null) {
      const { data: versionRecord, error: versionError } = await supabase
        .from('document_versions')
        .select('file_path, file_name, mime_type, version_number')
        .eq('document_id', id)
        .eq('version_number', requestedVersion)
        .single();

      if (versionError || !versionRecord) {
        throw createError('Document version not found', 404);
      }

      filePath = versionRecord.file_path || filePath;
      fileName = versionRecord.file_name || fileName;
      mimeType = versionRecord.mime_type || mimeType;
    }

    if (purpose === 'download') {
      // Force download by streaming file through backend
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('documents')
          .download(filePath);

        if (downloadError) {
          console.error('❌ File download failed:', downloadError);
          throw createError('Failed to download file', 500);
        }

        // Convert blob to buffer
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Set appropriate headers
        res.setHeader('Content-Type', mimeType || 'application/octet-stream');
        res.setHeader('Content-Length', buffer.length);
        
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Cache-Control', 'private, max-age=3600');

        // Send the file content
        res.send(buffer);
      } catch (error) {
        console.error('❌ Error serving file:', error);
        throw createError('Failed to serve file', 500);
      }
      return;
    }

    if (purpose === 'view') {
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      if (urlError || !signedUrl) {
        throw createError('Failed to generate view URL', 500);
      }

      res.json({
        view_url: signedUrl.signedUrl,
        file_name: fileName,
        mime_type: mimeType
      });
      return;
    } else {
      // For download, return signed URL
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (urlError) {
        throw createError('Failed to generate download URL', 500);
      }

      res.json({
        download_url: signedUrl.signedUrl,
        file_name: fileName,
        mime_type: mimeType
      });
    }
  });

  static getDocumentVersions = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;

    const { data: versions, error } = await supabase
      .from('document_versions')
      .select(`
        *,
        profiles!document_versions_uploaded_by_fkey(full_name, email)
      `)
      .eq('document_id', id)
      .order('version_number', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      versions: versions || [],
      total: versions?.length || 0
    });
  });

  static uploadDocumentVersion = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const { change_notes } = req.body;
    const file = req.file;

    if (!file) {
      throw createError('No file uploaded', 400);
    }

    // Get current document
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('foundation_id')
      .eq('id', id)
      .single();

    if (documentError) {
      throw createError('Document not found', 404);
    }

    // Get next version number
    const { data: lastVersion, error: versionError } = await supabase
      .from('document_versions')
      .select('version_number')
      .eq('document_id', id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = (lastVersion?.version_number || 0) + 1;

    // Upload new version file
    const fileName = `${Date.now()}-v${nextVersionNumber}-${file.originalname}`;
    const filePath = `documents/${document.foundation_id}/versions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      throw createError('File upload failed', 500);
    }

    // Create version record
    const { data: version, error: versionInsertError } = await supabase
      .from('document_versions')
      .insert({
        document_id: id,
        version_number: nextVersionNumber,
        file_path: filePath,
        file_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_by: req.user?.user_id,
        change_notes,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (versionInsertError) {
      // Clean up uploaded file if version creation fails
      await supabase.storage.from('documents').remove([filePath]);
      throw createError(versionInsertError.message, 400);
    }

    res.status(201).json({
      message: 'Document version uploaded successfully',
      version
    });
  });

  // Get available document types - return default types since document_types table is removed
  static getDocumentTypes = asyncHandler(async (req: JWTRequest, res: Response) => {
    // Return default document types since document_types table is removed
    const defaultTypes = [
      { value: 'articles_of_association', label: 'Articles of Association' },
      { value: 'bylaws', label: 'Bylaws' },
      { value: 'financial_statement', label: 'Financial Statement' },
      { value: 'board_resolution', label: 'Board Resolution' },
      { value: 'other', label: 'Other' }
    ];
    
    return res.json({
      document_types: defaultTypes,
      total: defaultTypes.length
    });
  });

  // Create default document types for a foundation - disabled since document_types table is removed
  static createDefaultDocumentTypes = asyncHandler(async (req: JWTRequest, res: Response) => {
    // Document types table is removed, so this endpoint is no longer needed
    return res.json({
      message: 'Document types table is removed. Use custom document types instead.',
      document_types: [],
      total: 0
    });
  });
}

