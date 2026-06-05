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

  ngOnInit() {
    this.usuarioLogueado = this.servicioUsuario.getUsuarioActual();
  }

  isLoggedIn() {
    this.usuarioLogueado = this.servicioUsuario.getUsuarioActual();
    return this.usuarioLogueado !== null;
  }

  logout() {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
      this.servicioUsuario.logout();
      this.usuarioLogueado = null;
      this.router.navigate(['/']); 
    }
  }
}