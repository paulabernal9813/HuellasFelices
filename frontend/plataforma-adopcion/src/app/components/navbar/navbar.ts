import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsuariosServices } from '../../services/usuario-service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  usuarioLogueado: Usuario | null = null;

  constructor(private servicioUsuario: UsuariosServices, private router: Router) {}

  ngOnInit(): void {
    // Comprobamos si hay sesión al cargar
    this.usuarioLogueado = this.servicioUsuario.getUsuarioActual();
  }

  // Este método sirve para que el HTML se entere instantáneamente si el usuario inicia o cierra sesión
  isLoggedIn(): boolean {
    this.usuarioLogueado = this.servicioUsuario.getUsuarioActual();
    return this.usuarioLogueado !== null;
  }

  logout(): void {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
      this.servicioUsuario.logout();
      this.usuarioLogueado = null;
      this.router.navigate(['/']); // Redirige al catálogo principal
    }
  }
}