import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UsuariosServices } from '../../services/usuario-service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'adoptante'
  };

  errorMensaje: string = '';
  exitoMensaje: string = '';

  constructor(
    private servicioUsuarios: UsuariosServices,
    private router: Router
  ) { }

  onRegistro() {
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.errorMensaje = '⚠️ Por favor, rellena todos los campos obligatorios.';
      return;
    }

    this.servicioUsuarios.registrarUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        if (res && res.error) {
          this.errorMensaje = '❌ ' + res.error;
        } else {
          this.exitoMensaje = '🎉 ¡Cuenta creada con éxito! Iniciando sesión automáticamente...';

          this.servicioUsuarios.login(this.nuevoUsuario.email, this.nuevoUsuario.password).subscribe({
            next: (loginRes) => {
              if (loginRes && loginRes.id) {
                console.log('¡Auto-login completado con éxito!', loginRes);

                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 1200);
              } else {
                this.router.navigate(['/login']);
              }
            },
            error: (loginErr) => {
              console.error('Error en el auto-login:', loginErr);
              this.router.navigate(['/login']);
            }
          });

        }
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.errorMensaje = '💥 Error al conectar con el servidor XAMPP.';
      }
    });
  }
}