
interface ApiFetchOptions extends RequestInit{
    headers?:HeadersInit
}
export const apiFetch = async (url:string, options:ApiFetchOptions = {}):Promise<Response> => {
    const accessToken = localStorage.getItem('access_token');
    const headers = {
    ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };


    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('access_token', refreshData.access);

            return apiFetch(url, options);
        } else {
            window.location.href = '/login';
        }
    }

    return response;
};


