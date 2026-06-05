import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnimalesServices } from '../../services/animal-service';

@Component({
  selector: 'app-ficha-animal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ficha-animal.html',
  styleUrl: './ficha-animal.css'
})
export class FichaAnimalComponent implements OnInit {
  idAnimal!: number;
  datosAnimal: any = null;

  constructor(
    private route: ActivatedRoute,
    private servicioAnimales: AnimalesServices,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.idAnimal = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idAnimal) {
      this.servicioAnimales.obtenerAnimalId(this.idAnimal).subscribe({
        next: (res) => {
          this.datosAnimal = res;
          this.cdr.detectChanges();
        },
        error: () => {
          alert('❌ Ocurrió un error al cargar la ficha del animal.');
        }
      });
    }
  }
}