const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ataraxia-api.studios-tkoh.online/api/v1';

let refreshPromise: Promise<boolean> | null = null;

export async function tryRefreshToken(): Promise<boolean> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = _doRefresh();
    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

async function _doRefresh(): Promise<boolean> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) return false;

        const data = await res.json();
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        if (data.refresh_token) {
            localStorage.setItem('refreshToken', data.refresh_token);
        }
        return true;
    } catch {
        return false;
    }
}

export function clearAuthTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
}
