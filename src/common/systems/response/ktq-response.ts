export default class KtqResponse {
    public static toResponse(data: any, options?: { message?: string; status_code?: number; bonus?: any }) {
        return {
            message: options?.message || '',
            status_code: options?.status_code || 200,
            data: data,
            timestamp: new Date().toISOString(),
            ...(options?.bonus || {}),
        };
    }
}
