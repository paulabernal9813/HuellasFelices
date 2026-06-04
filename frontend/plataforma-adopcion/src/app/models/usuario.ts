export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    password?: string; // Opcional para cuando listamos perfiles públicos sin contraseña
    rol: 'adoptante' | 'protectora';
    created_at?: string;
}