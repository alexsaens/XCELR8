import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(await getAuthHeaders()),
    ...options?.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

// Submissions
export const api = {
  submissions: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ submissions: unknown[] }>(`/submissions${qs}`);
    },
    get: (id: string) => request<unknown>(`/submissions/${id}`),
    create: (data: { title: string; contentType: string; fileNames: { name: string; type: string }[] }) =>
      request<unknown>('/submissions', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<unknown>(`/submissions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  reviews: {
    listForSubmission: (submissionId: string) =>
      request<{ reviews: unknown[] }>(`/reviews/submission/${submissionId}`),
    create: (data: { submissionId: string; decision: string; comments?: unknown[]; precedentsCited?: unknown[] }) =>
      request<unknown>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  },

  chat: {
    getHistory: (submissionId: string) =>
      request<{ messages: unknown[] }>(`/chat/${submissionId}`),
    send: (submissionId: string, message: string) =>
      request<unknown>(`/chat/${submissionId}`, { method: 'POST', body: JSON.stringify({ message }) }),
  },

  rag: {
    list: () => request<{ documents: unknown[] }>('/rag'),
    upload: (data: { title: string; category: string; fileName: string; fileType: string }) =>
      request<unknown>('/rag', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request<unknown>(`/rag/${id}`, { method: 'DELETE' }),
  },

  audit: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ entries: unknown[] }>(`/audit${qs}`);
    },
    analytics: () => request<unknown>('/audit/analytics'),
  },

  admin: {
    listUsers: () => request<{ users: unknown[] }>('/admin/users'),
    createUser: (data: { email: string; name: string; role: string; password: string }) =>
      request<unknown>('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateRole: (uid: string, role: string) =>
      request<unknown>(`/admin/users/${uid}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    deleteUser: (uid: string) =>
      request<unknown>(`/admin/users/${uid}`, { method: 'DELETE' }),
  },
};
