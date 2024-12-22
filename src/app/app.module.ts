import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmpresaComponent } from './dashboard/empresa/empresa.component';
import { SociosComponent } from './dashboard/socios/socios.component';
import { LoadingComponent } from './loading/loading.component';
import { CadastrarEmpresaComponent } from './dashboard/cadastrar-empresa/cadastrar-empresa.component';
import { EditarEmpresaComponent } from './editar-empresa/editar-empresa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CadastrarSocioComponent } from './dashboard/cadastrar-socio/cadastrar-socio.component';
import { EditarSocioComponent } from './dashboard/editar-socio/editar-socio.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EmpresaComponent,
    SociosComponent,
    LoadingComponent,
    CadastrarEmpresaComponent,
    EditarEmpresaComponent,
    CadastrarSocioComponent,
    EditarSocioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
