// Update this with your computer's local IP address if testing on physical device
// Find it by running 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)
const API_URL = 'http://192.168.0.247:3000';

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    },

    post: async (endpoint: string, data: any) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const text = await response.text();
            try {
                const resData = JSON.parse(text);
                if (!response.ok) {
                    throw resData || new Error(`API Error: ${response.statusText}`);
                }
                return resData;
            } catch (e) {
                console.error('JSON Parse Error. Raw response:', text);
                throw new Error('Invalid server response');
            }
        } catch (error) {
            console.error('Network Request Failed:', error);
            throw error;
        }
    },

    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    },

    delete: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    }
};
