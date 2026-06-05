import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Imprescindible para enlazar el formulario con [(ngModel)]
import { Router } from '@angular/router';
import { UsuariosServices } from '../../services/usuario-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMensaje: string = '';

  constructor(
    private servicioUsuarios: UsuariosServices,
    private router: Router
  ) {}

  onLogin() {
    this.errorMensaje = '';

    if (!this.email || !this.password) {
      this.errorMensaje = '⚠️ Por favor, rellena todos los campos.';
      return;
    }

    this.servicioUsuarios.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res && res.id) {
          console.log('¡Login correcto!', res);
          this.router.navigate(['/']);
        } else {
          this.errorMensaje = '❌ Correo o contraseña incorrectos.';
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMensaje = '💥 Error al conectar con el servidor XAMPP.';
      }
    });
  }
}