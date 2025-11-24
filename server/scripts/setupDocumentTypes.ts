import { supabase } from '../config/database';

interface DocumentTypeTemplate {
  name: string;
  description: string;
}

const DEFAULT_DOCUMENT_TYPES: DocumentTypeTemplate[] = [
  {
    name: 'Articles of Association',
    description: 'Legal document that defines the foundation\'s purpose, structure, and governance'
  },
  {
    name: 'Bylaws',
    description: 'Internal rules and procedures for the foundation\'s operations'
  },
  {
    name: 'Financial Statements',
    description: 'Annual financial reports and accounting documents'
  },
  {
    name: 'Board Resolutions',
    description: 'Official decisions and resolutions made by the board of directors'
  },
  {
    name: 'Meeting Minutes',
    description: 'Records of board meetings and general assemblies'
  },
  {
    name: 'Audit Reports',
    description: 'External audit findings and recommendations'
  },
  {
    name: 'Tax Documents',
    description: 'Tax returns and related compliance documents'
  },
  {
    name: 'Legal Documents',
    description: 'Contracts, agreements, and other legal documents'
  },
  {
    name: 'Insurance Documents',
    description: 'Insurance policies and related documentation'
  },
  {
    name: 'Other',
    description: 'Miscellaneous documents not covered by other categories'
  }
];

export async function setupDocumentTypesForFoundation(foundationId: string, createdBy?: string) {
  try {
    console.log(`Setting up document types for foundation: ${foundationId}`);

    // Check if document types already exist for this foundation
    const { data: existingTypes, error: checkError } = await supabase
      .from('document_types')
      .select('id')
      .eq('foundation_id', foundationId);

    if (checkError) {
      throw new Error(`Error checking existing document types: ${checkError.message}`);
    }

    if (existingTypes && existingTypes.length > 0) {
      console.log(`Document types already exist for foundation ${foundationId}. Skipping setup.`);
      return existingTypes;
    }

    // Create document types
    const documentTypesToCreate = DEFAULT_DOCUMENT_TYPES.map(type => ({
      foundation_id: foundationId,
      name: type.name,
      description: type.description,
      is_active: true,
      created_by: createdBy,
      updated_by: createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: createdTypes, error: createError } = await supabase
      .from('document_types')
      .insert(documentTypesToCreate)
      .select();

    if (createError) {
      throw new Error(`Error creating document types: ${createError.message}`);
    }

    console.log(`Successfully created ${createdTypes?.length || 0} document types for foundation ${foundationId}`);
    return createdTypes;

  } catch (error) {
    console.error('Error setting up document types:', error);
    throw error;
  }
}

export async function setupDocumentTypesForAllFoundations() {
  try {
    console.log('Setting up document types for all foundations...');

    // Get all foundations
    const { data: foundations, error: foundationsError } = await supabase
      .from('foundations')
      .select('id, name');

    if (foundationsError) {
      throw new Error(`Error fetching foundations: ${foundationsError.message}`);
    }

    if (!foundations || foundations.length === 0) {
      console.log('No foundations found. Skipping document type setup.');
      return;
    }

    // Setup document types for each foundation
    for (const foundation of foundations) {
      await setupDocumentTypesForFoundation(foundation.id);
    }

    console.log(`Document types setup completed for ${foundations.length} foundations`);

  } catch (error) {
    console.error('Error setting up document types for all foundations:', error);
    throw error;
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDocumentTypesForAllFoundations()
    .then(() => {
      console.log('Document types setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Document types setup failed:', error);
      process.exit(1);
    });
}

