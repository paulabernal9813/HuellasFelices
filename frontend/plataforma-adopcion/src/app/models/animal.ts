export interface Animal {
    id: number;
    usuario_id: number; // ID de la protectora dueña
    nombre: string;
    especie: string;
    raza: string;
    edad: string;
    tamano: string;
    estado: 'disponible' | 'reservado' | 'adoptado';
    descripcion: string;
    imagen_url: string;
    nombre_protectora?: string; // Viene del INNER JOIN en el catálogo público
    email_protectora?: string;  // Viene del INNER JOIN en el detalle del animal
    created_at?: string;
}