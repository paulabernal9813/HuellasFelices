import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Animal } from '../../models/animal';
import { AnimalesServices } from '../../services/animal-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animal-lista',
  standalone: true, // Modo moderno Standalone
  templateUrl: './animal-lista.html',
  styleUrl: './animal-lista.css',
})
export class AnimalLista {
  @Input() animal: Animal;
  @Output() eliminado = new EventEmitter();

  constructor(private servicioAnimal: AnimalesServices, private ruta: Router) {
    this.animal = <Animal>{};
  }

  deleteAnimal(animal: Animal) {
    if (confirm(`¿Deseas eliminar a "${animal.nombre}" de la adopción?`)) {
      this.servicioAnimal.borraAnimal(animal.id).subscribe({
        next: (res) => {
          console.log('res: ', res);
          // Aplicamos tu misma comprobación exacta del archivo de ejemplo
          if (res.result == 'OK') {
            this.eliminado.emit(res); // Avisamos al perfil que re-liste los animales
          } else {
            console.log('No se ha podido eliminar el animal');
          }
        },
      });
    }
  }

  editarAnimal(animal: Animal) {
    // Redirige al formulario de edición pasándole el ID
    this.ruta.navigate(['/animal-editar', animal.id]);
  }
}