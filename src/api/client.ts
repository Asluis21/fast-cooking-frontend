const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(status: number, data:unknown){
        super(`Request failed with status ${status}`);
        this.status=status;
        this.data=data;
    }
}

export function apiFetch(
    path:string,
    options: RequestInit = {}
) : Promise<Response>{

    const url = `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    
    const headers = new Headers(options.headers);
    const hasJsonBody = typeof options.body === "string";

    if (hasJsonBody && !headers.has("Content-Type")){
        headers.set("Content-Tye", "application/json");
    }

    return fetch(url, {...options, headers})
}

export async function api<T>(
    path:string, 
    {body, ...options}: Omit<RequestInit, "body"> & {body?:unknown} = {}
): Promise<T> {
    
    const res = await apiFetch(path, {
            ...options,
            body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    })

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = res.status === 204 ? undefined : isJson ? await res.json() : await res.text();

    if(!res.ok) throw new ApiError(res.status, data);

    return data as T;
}