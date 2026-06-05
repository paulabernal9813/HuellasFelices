import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuariosServices } from '../../services/usuario-service'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-protectoras',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './protectoras.html',
  styleUrl: './protectoras.css'
})
export class ProtectorasComponent implements OnInit {
  listaProtectoras: any[] = [];

  constructor(
    private servicioUsuarios: UsuariosServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.servicioUsuarios.listarProtectoras().subscribe({
      next: (res) => {
        this.listaProtectoras = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar protectoras:', err);
      }
    });
  }
}