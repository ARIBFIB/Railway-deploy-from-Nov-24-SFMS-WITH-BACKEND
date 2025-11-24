export interface ApiOptions extends RequestInit {
  json?: unknown;
  attachTenant?: boolean;
}

export const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

export async function apiFetch(input: string, init: ApiOptions = {}): Promise<Response> {
  const token = localStorage.getItem('auth_token') || '';
  const userDataRaw = localStorage.getItem('user_data') || '{}';
  const userData = safeParse(userDataRaw);
  const foundationId = userData?.foundationId || userData?.foundation_id || userData?.foundationId;
  const userId = userData?.id || userData?.user_id;
  const roleId = userData?.roleId || userData?.role_id;

  // Add base URL for API calls
  // If input is already a full URL, use it. Otherwise, prepend API_BASE_URL
  const fullUrl = input.startsWith('http') ? input : `${API_BASE_URL}${input}`;

  // Enhanced debug logging
  console.log('🔍 API Fetch Debug:', {
    foundationId,
    userId,
    roleId,
    hasToken: !!token,
    tokenLength: token.length,
    userData: userData,
    url: fullUrl,
    method: init.method || 'GET'
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(foundationId ? { 'X-Foundation-ID': String(foundationId) } : {})
  };

  const shouldAttachTenant = init.attachTenant !== false; // default true
  const bodyJson = init.json ?? (init.body ? undefined : undefined);

  const finalBody = shouldAttachTenant && bodyJson && typeof bodyJson === 'object'
    ? {
      foundationId,
      foundation_id: foundationId,
      userId,
      roleId,
      ...bodyJson
    }
    : bodyJson;

  const requestInit: RequestInit = {
    ...init,
    headers: { ...headers, ...(init.headers as any) },
    body: finalBody !== undefined ? JSON.stringify(finalBody) : init.body
  };

  console.log('🚀 Making API request:', {
    url: fullUrl,
    method: requestInit.method || 'GET',
    headers: headers,
    hasBody: !!requestInit.body
  });

  try {
    const response = await fetch(fullUrl, requestInit);

    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Log response body for debugging (but don't consume it)
    if (!response.ok) {
      const responseClone = response.clone();
      try {
        const errorText = await responseClone.text();
        console.error('❌ API Error Response Body:', errorText);
      } catch (e) {
        console.error('❌ Could not read error response body:', e);
      }
    }

    return response;
  } catch (error) {
    console.error('❌ API Request Error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: fullUrl,
      method: requestInit.method || 'GET'
    });
    throw error;
  }
}

function safeParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

// Document Types API
export interface DocumentType {
  id: string;
  foundation_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export const documentTypesApi = {
  // Get all document types for the current foundation
  async getDocumentTypes(): Promise<DocumentType[]> {
    const response = await apiFetch('/api/document-types');
    if (!response.ok) {
      throw new Error('Failed to fetch document types');
    }
    const data = await response.json();
    return data.data;
  },

  // Create a new document type
  async createDocumentType(name: string, foundationId?: string): Promise<DocumentType> {
    const response = await apiFetch('/api/document-types', {
      method: 'POST',
      json: { name, foundation_id: foundationId }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create document type');
    }
    const data = await response.json();
    return data.data;
  },

  // Update a document type
  async updateDocumentType(id: string, name: string): Promise<DocumentType> {
    const response = await apiFetch(`/api/document-types/${id}`, {
      method: 'PUT',
      json: { name }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update document type');
    }
    const data = await response.json();
    return data.data;
  },

  // Delete a document type
  async deleteDocumentType(id: string): Promise<void> {
    const response = await apiFetch(`/api/document-types/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete document type');
    }
  },

  // Bulk create document types
  async bulkCreateDocumentTypes(types: string[]): Promise<DocumentType[]> {
    const response = await apiFetch('/api/document-types/bulk', {
      method: 'POST',
      json: { types }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create document types');
    }
    const data = await response.json();
    return data.data;
  }
};


