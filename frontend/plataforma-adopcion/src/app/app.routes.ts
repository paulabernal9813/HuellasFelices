import { Routes } from '@angular/router';
import { PanelPrincipalComponent } from './components/panel-principal/panel-principal';
import { ProtectorasComponent } from './components/protectoras/protectoras';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { PerfilComponent } from './components/perfil/perfil';
import { DetalleProtectorasComponent } from './components/detalle-protectoras/detalle-protectoras';
import { FichaAnimalComponent } from './components/ficha-animal/ficha-animal';

export const routes: Routes = [
  { path: '', component: PanelPrincipalComponent },
  { path: 'protectoras', component: ProtectorasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'protectoras/:id', component: DetalleProtectorasComponent},
  { path: 'animal/:id', component: FichaAnimalComponent },
  { path: '**', redirectTo: '' }
];
