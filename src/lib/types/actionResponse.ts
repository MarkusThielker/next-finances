export interface ActionResponse<T = any> {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    redirect?: string;
    data?: T;
}
