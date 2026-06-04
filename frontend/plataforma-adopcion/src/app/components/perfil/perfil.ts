import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosServices } from '../../services/usuario-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  usuarioActual: any = null;
  usuarioRespaldo: any = null; // Guardará una copia limpia por si cancelan la edición
  editando: boolean = false;   // Controla si los inputs están bloqueados o no

  errorMensaje: string = '';
  exitoMensaje: string = '';

  constructor(
    private servicioUsuarios: UsuariosServices,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.servicioUsuarios.getUsuarioActual();
    if (user) {
      this.usuarioActual = { ...user };
      this.usuarioActual.password = ''; // Dejamos la contraseña visualmente vacía por seguridad
    } else {
      this.router.navigate(['/']);
    }
  }

  // Activa el modo edición y guarda una copia por si cancela
  onActivarEdicion(): void {
    this.editando = true;
    this.usuarioRespaldo = { ...this.usuarioActual }; // Hacemos copia de seguridad
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }

  // Restaura los datos originales y vuelve al modo lectura
  onCancelar(): void {
    this.usuarioActual = { ...this.usuarioRespaldo }; // Recuperamos el respaldo
    this.editando = false;
    this.errorMensaje = '';
  }

  onGuardarCambios(): void {
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (!this.usuarioActual.nombre || !this.usuarioActual.email) {
      this.errorMensaje = '⚠️ El nombre y el correo electrónico son obligatorios.';
      return;
    }

    this.servicioUsuarios.modificarUsuario(this.usuarioActual).subscribe({
      next: (res) => {
        if (res && res.error) {
          this.errorMensaje = '❌ ' + res.error;
        } else {
          this.exitoMensaje = '💾 ¡Datos actualizados con éxito!';
          this.editando = false; // Volvemos al modo lectura automáticamente
          
          // Guardamos en la sesión local (si no cambió password, mantenemos la que tenía)
          localStorage.setItem('usuario_logueado', JSON.stringify(this.usuarioActual));
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al modificar:', err);
        this.errorMensaje = '💥 Error al conectar con el servidor XAMPP.';
      }
    });
  }

  onEliminarCuenta(): void {
    const confirmar = confirm('⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción borrará tus datos y es irreversible.');
    if (confirmar && this.usuarioActual.id) {
      this.servicioUsuarios.eliminarUsuario(this.usuarioActual.id).subscribe({
        next: () => {
          alert('Cuenta eliminada con éxito. 👋');
          this.servicioUsuarios.logout();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al borrar la cuenta:', err);
          alert('💥 Error al intentar eliminar la cuenta del servidor XAMPP.');
        }
      });
    }
  }
}