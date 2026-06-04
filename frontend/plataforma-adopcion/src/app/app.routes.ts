import { Routes } from '@angular/router';
import { PanelPrincipalComponent } from './components/panel-principal/panel-principal';
import { ProtectorasComponent } from './components/protectoras/protectoras';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: PanelPrincipalComponent },
  { path: 'protectoras', component: ProtectorasComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'registro', component: RegistroComponent },
  // { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '' } // Si ponen una ruta rara, vuelve al catálogo
];
