import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsuariosServices } from '../../services/usuario-service';
import { AnimalesServices } from '../../services/animal-service';

@Component({
  selector: 'app-detalle-protectoras',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-protectoras.html',
  styleUrl: './detalle-protectoras.css'
})
export class DetalleProtectorasComponent implements OnInit {
  idProtectora!: number;
  datosProtectora: any = null;
  animalesEnAdopcion: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private servicioUsuarios: UsuariosServices,
    private servicioAnimales: AnimalesServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.idProtectora = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idProtectora) {
      this.servicioUsuarios.listarProtectoras().subscribe({
        next: (res: any[]) => {
          this.datosProtectora = res.find(p => p.id === this.idProtectora);
          this.cdr.detectChanges();
        }
      });

      this.servicioAnimales.listarAnimalesProtectora(this.idProtectora).subscribe({
        next: (res) => {
          this.animalesEnAdopcion = res;
          this.cdr.detectChanges();
        }
      });
    }
  }
}