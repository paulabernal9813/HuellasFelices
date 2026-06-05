import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Animal } from '../models/animal';

@Injectable({
  providedIn: 'root',
})
export class AnimalesServices {
  private url = environment.API_URL;

  constructor(private http: HttpClient) { }

  listarAnimales() {
    const cuerpo = { accion: 'ListarAnimales' };
    return this.http.post<Animal[]>(this.url, cuerpo);
  }
  
  listarAnimalesProtectora(usuario_id: number) {
    let pa = JSON.stringify({
      accion: 'ListarAnimalesProtectora',
      usuario_id: usuario_id,
    });
    return this.http.post<Animal[]>(this.url, pa);
  }

  obtenerAnimalId(id: number) {
    let pa = JSON.stringify({
      accion: 'ObtenerAnimalId',
      id: id,
    });
    return this.http.post<Animal>(this.url, pa);
  }

  altaAnimal(animal: any) {
    let pa = JSON.stringify({
      accion: 'AltaAnimal',
      animal: animal,
    });
    return this.http.post<any>(this.url, pa);
  }

  modificaAnimal(animal: Animal) {
    let pa = JSON.stringify({
      accion: 'ModificaAnimal',
      animal: animal,
    });
    return this.http.post<any>(this.url, pa);
  }

  borraAnimal(id: number) {
    let pa = JSON.stringify({
      accion: 'BorraAnimal',
      id: id,
    });
    return this.http.post<any>(this.url, pa);
  }
}