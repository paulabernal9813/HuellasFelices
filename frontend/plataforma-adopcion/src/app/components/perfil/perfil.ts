import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosServices } from '../../services/usuario-service';
import { AnimalesServices } from '../../services/animal-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  usuarioActual: any = null;
  usuarioRespaldo: any = null;
  editando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';

  misAnimales: any[] = [];
  editandoAnimal: boolean = false; 

  nuevoAnimal: any = {
    id: null,
    nombre: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    tamano: 'Mediano',
    estado: 'disponible',
    descripcion: '',
    imagen_url: ''
  };

  constructor(
    private servicioUsuarios: UsuariosServices,
    private servicioAnimales: AnimalesServices,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.servicioUsuarios.getUsuarioActual();
    if (user) {
      this.usuarioActual = { ...user };
      this.usuarioActual.password = '';

      if (this.usuarioActual.rol === 'protectora') {
        this.cargarMisAnimales();
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  // --- MÉTODOS DEL USUARIO ---
  onActivarEdicion() {
    this.editando = true;
    this.usuarioRespaldo = { ...this.usuarioActual };
  }

  onCancelar() {
    this.usuarioActual = { ...this.usuarioRespaldo };
    this.editando = false;
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }

  onGuardarCambios() {
    this.errorMensaje = '';
    this.exitoMensaje = '';

    this.servicioUsuarios.modificarUsuario(this.usuarioActual).subscribe({
      next: (res: any) => {
        if (res && res.result === 'OK') {
          this.exitoMensaje = '💾 ¡Datos de tu cuenta actualizados con éxito!';
          this.editando = false;

          const datosGuardar = { ...this.usuarioActual };
          datosGuardar.password = '';
          localStorage.setItem('usuario_logueado', JSON.stringify(datosGuardar));

          this.cdr.detectChanges();
        } else {
          this.errorMensaje = '❌ No se pudieron guardar los cambios.';
        }
      },
      error: () => {
        this.errorMensaje = '❌ Error de red al intentar actualizar el perfil.';
      }
    });
  }

  onEliminarCuenta() {
    if (confirm('⚠️ ¿Estás seguro de que deseas borrar tu cuenta de forma permanente?')) {
      this.servicioUsuarios.eliminarUsuario(this.usuarioActual.id).subscribe({
        next: (res: any) => {
          if (res && res.result === 'OK') {
            alert('Cuenta eliminada correctamente. ¡Hasta pronto! 👋');
            this.servicioUsuarios.logout();
            this.router.navigate(['/']);
          } else if (res && res.result === 'HAS_ANIMALS') {
            alert('❌ No puedes eliminar la cuenta: Tienes animales publicados en adopción. Debes quitarlos primero.');
          } else {
            alert('❌ Error: No se pudo eliminar la cuenta en este momento.');
          }
        },
        error: () => {
          alert('❌ Ocurrió un error de comunicación con el servidor.');
        }
      });
    }
  }

  cargarMisAnimales() {
    this.servicioAnimales.listarAnimalesProtectora(this.usuarioActual.id).subscribe({
      next: (res) => {
        this.misAnimales = res;
        this.cdr.detectChanges();
      }
    });
  }

  onNuevoAnimal() {
    this.editandoAnimal = true;
    this.nuevoAnimal = { id: null, usuario_id: this.usuarioActual.id, nombre: '', especie: 'Perro', raza: '', edad: '', tamano: 'Mediano', estado: 'disponible', descripcion: '', imagen_url: '' };
  }

  onEditarAnimal(animal: any) {
    this.editandoAnimal = true;
    this.nuevoAnimal = { ...animal };
  }

  onCancelarAnimal() {
    this.editandoAnimal = false;
  }

  onGuardarAnimal() {
    if (!this.nuevoAnimal.nombre || !this.nuevoAnimal.raza) {
      alert('⚠️ Nombre y Raza son obligatorios.');
      return;
    }

    if (this.nuevoAnimal.id === null) {
      this.servicioAnimales.altaAnimal(this.nuevoAnimal).subscribe({
        next: () => {
          this.editandoAnimal = false;
          this.cargarMisAnimales(); // Recargamos la lista
          alert('🎉 ¡Animal publicado con éxito!');
        }
      });
    } else {

      this.servicioAnimales.modificaAnimal(this.nuevoAnimal).subscribe({
        next: () => {
          this.editandoAnimal = false;
          this.cargarMisAnimales();
          alert('💾 ¡Cambios del animal guardados!');
        }
      });
    }
  }

  onBorrarAnimal(id: number) {
    if (confirm('❌ ¿Estás seguro de que quieres retirar a este animal de la adopción?')) {
      this.servicioAnimales.borraAnimal(id).subscribe({
        next: () => {
          this.cargarMisAnimales();
          alert('Animal eliminado correctamente.');
        }
      });
    }
  }
}