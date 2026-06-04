import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalesServices } from '../../services/animal-service'; // Ajusta la ruta a tu archivo de servicio

@Component({
  selector: 'app-panel-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel-principal.html',
  styleUrl: './panel-principal.css'
})
export class PanelPrincipalComponent implements OnInit {
  listaAnimales: any[] = [];

  constructor(
    private servicioAnimales: AnimalesServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obtenerMascotas();
  }

  obtenerMascotas() {
    this.servicioAnimales.listarAnimales().subscribe({
      next: (res) => {
        this.listaAnimales = res;
        this.cdr.detectChanges();
        console.log('Animales cargados desde XAMPP:', res);
      },
      error: (err) => {
        console.error('Error al conectar con el PHP:', err);
      }
    });
  }
}