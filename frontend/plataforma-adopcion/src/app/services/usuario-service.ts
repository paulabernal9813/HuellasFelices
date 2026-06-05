import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosServices {
  private url = environment.API_URL; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    let pa = JSON.stringify({
      accion: 'Login',
      email: email,
      password: password,
    });
    return this.http.post<any>(this.url, pa).pipe(
      tap((res) => {
        if (res) {
          localStorage.setItem('usuario_logueado', JSON.stringify(res));
        }
      })
    );
  }

  registrarUsuario(usuario: any) {
    let pa = JSON.stringify({
      accion: 'RegistrarUsuario',
      usuario: usuario,
    });
    return this.http.post<any>(this.url, pa);
  }

  modificarUsuario(usuario: Usuario) {
    let pa = JSON.stringify({
      accion: 'ModificarUsuario',
      usuario: usuario,
    });
    return this.http.post<any>(this.url, pa);
  }

  eliminarUsuario(id: number) {
    let pa = JSON.stringify({
      accion: 'EliminarUsuario',
      id: id,
    });
    return this.http.post<any>(this.url, pa);
  }

  listarProtectoras() {
    let pa = JSON.stringify({
      accion: 'ListarProtectoras',
    });
    return this.http.post<Usuario[]>(this.url, pa);
  }

  getUsuarioActual(): Usuario | null {
    const user = localStorage.getItem('usuario_logueado');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('usuario_logueado');
  }
}