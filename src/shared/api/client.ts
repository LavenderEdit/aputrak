import { OpenAPI } from './generated/core/OpenAPI';

export const setupApiClient = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ataraxia-api.studios-tkoh.online';
    OpenAPI.BASE = envUrl.replace('/api/v1', '');
    
    // Add custom token resolver if needed
    OpenAPI.TOKEN = async () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || '';
        }
        return '';
    };
};

// Auto initialize on import if we are in browser
if (typeof window !== 'undefined') {
    setupApiClient();
}

export * from './generated';
