import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Imprescindible para vincular con [(ngModel)]
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
  // Objeto con la estructura exacta que espera tu base de datos
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'adoptante' // Valor por defecto en la base de datos
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

    // 1. Validación básica en el frontend
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.errorMensaje = '⚠️ Por favor, rellena todos los campos obligatorios.';
      return;
    }

    // 2. Enviamos el registro a la base de datos
    this.servicioUsuarios.registrarUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        if (res && res.error) {
          this.errorMensaje = '❌ ' + res.error;
        } else {
          this.exitoMensaje = '🎉 ¡Cuenta creada con éxito! Iniciando sesión automáticamente...';

          // 3. ¡LA MAGIA! Logueamos al usuario directamente usando sus credenciales recién creadas
          this.servicioUsuarios.login(this.nuevoUsuario.email, this.nuevoUsuario.password).subscribe({
            next: (loginRes) => {
              if (loginRes && loginRes.id) {
                console.log('¡Auto-login completado con éxito!', loginRes);

                // Esperamos un segundo pequeño para que vea el mensaje de éxito y redirigimos al catálogo principal
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 1200);
              } else {
                // Por si acaso fallara el login (raro), lo mandamos a la pantalla de login tradicional
                this.router.navigate(['/login']);
              }
            },
            error: (loginErr) => {
              console.error('Error en el auto-login:', loginErr);
              this.router.navigate(['/login']); // Salvavidas si se cae la conexión en mitad del proceso
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