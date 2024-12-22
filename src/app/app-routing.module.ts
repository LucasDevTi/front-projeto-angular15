import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { EmpresaComponent } from './dashboard/empresa/empresa.component';
import { SociosComponent } from './dashboard/socios/socios.component';
import { CadastrarEmpresaComponent } from './dashboard/cadastrar-empresa/cadastrar-empresa.component';
import { EditarEmpresaComponent } from './editar-empresa/editar-empresa.component';
import { CadastrarSocioComponent } from './dashboard/cadastrar-socio/cadastrar-socio.component';
import { EditarSocioComponent } from './dashboard/editar-socio/editar-socio.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/empresa', component: EmpresaComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/socios', component: SociosComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/cadastrar-empresa', component: CadastrarEmpresaComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/editar-empresa/:id', component: EditarEmpresaComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/cadastrar-socio', component: CadastrarSocioComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/editar-socio/:id', component: EditarSocioComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'dashboard/empresa' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
