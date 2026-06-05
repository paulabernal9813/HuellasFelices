export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    password?: string;
    rol: 'adoptante' | 'protectora';
    created_at?: string;
}