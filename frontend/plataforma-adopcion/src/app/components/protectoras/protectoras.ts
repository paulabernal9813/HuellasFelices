import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Añadimos DatePipe aquí para el filtro del HTML
import { UsuariosServices } from '../../services/usuario-service'; 

@Component({
  selector: 'app-protectoras',
  standalone: true,
  imports: [CommonModule, DatePipe], // Añadimos DatePipe a los imports del componente standalone
  templateUrl: './protectoras.html',
  styleUrl: './protectoras.css'
})
export class ProtectorasComponent implements OnInit {
  listaProtectoras: any[] = [];

  // Corregido el nombre de la variable para que use tu servicio de Usuarios
  constructor(
    private servicioUsuarios: UsuariosServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Llamamos correctamente a la función de tu usuario-service
    this.servicioUsuarios.listarProtectoras().subscribe({
      next: (res) => {
        this.listaProtectoras = res;
        this.cdr.detectChanges(); // Fuerza a Angular a pintar las protectoras al instante
      },
      error: (err) => {
        console.error('Error al cargar protectoras:', err);
      }
    });
  }
}