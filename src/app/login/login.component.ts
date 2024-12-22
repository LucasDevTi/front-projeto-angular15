import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { LoadingService } from '../loading.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  onSubmit() {

    if (this.email && this.password) {
      this.loadingService.show();

      const loginData = {
        email: this.email, // Usando o email agora
        password: this.password,
      };

      this.http.post<any>('http://localhost:8000/login', loginData)
        .subscribe(
          (response) => {
            this.tokenService.setToken(response.token);
            localStorage.setItem('jwt', response.token);
            this.router.navigate(['/dashboard']);
            this.loadingService.hide();
          },
          (error) => {
            this.errorMessage = 'Erro ao realizar o login. Verifique suas credenciais.';
            this.loadingService.hide();
          }
        );
    } else {
      this.errorMessage = 'Preencha todos os campos.';
      this.loadingService.hide();
    }
  }
}
