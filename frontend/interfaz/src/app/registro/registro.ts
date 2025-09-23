import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
})
export class Registro {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  direccion: string = '';
  telefono: string = '';
  fechaNacimiento: string = '';
  password: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const userData = {
      email: this.email,
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      direccion: this.direccion,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento,
      password: this.password,
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.successMessage = 'Registro exitoso! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al registrar paciente';
      },
    });
  }
}
