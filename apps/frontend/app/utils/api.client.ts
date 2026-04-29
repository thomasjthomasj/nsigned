const { NEXT_PUBLIC_API_URL: API_URL } = process.env

export const endpoint = (endpoint: string) => `${API_URL}/${endpoint}`;
