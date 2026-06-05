export interface Animal {
    id: number;
    usuario_id: number;
    nombre: string;
    especie: string;
    raza: string;
    edad: string;
    tamano: string;
    estado: 'disponible' | 'reservado' | 'adoptado';
    descripcion: string;
    imagen_url: string;
    nombre_protectora?: string;
    email_protectora?: string;
    created_at?: string;
}