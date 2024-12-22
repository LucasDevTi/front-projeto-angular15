import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from '../../loading.service';

@Component({
  selector: 'app-cadastrar-socio',
  templateUrl: './cadastrar-socio.component.html',
  styleUrls: ['./cadastrar-socio.component.css']
})
export class CadastrarSocioComponent implements OnInit {
  socio = { nome: '', cpf: '', empresa_id: '' };
  empresas: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.loadingService.show();
    const url = 'http://127.0.0.1:8000/api/empresas';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.empresas = response;
        this.loadingService.hide();
      },
      (error) => {
        this.loadingService.hide();
        alert('Erro ao carregar as empresas.');
      }
    );
    this.loadingService.hide();
  }

  onSubmit(): void {

    if (!this.validateCpf(this.socio.cpf)) {
      alert('CPF inválido! Por favor, insira um CPF válido.');
      return;
    }

    this.loadingService.show();
    const url = 'http://127.0.0.1:8000/api/socio/create';
    this.http.post(url, this.socio).subscribe(
      (response) => {
        this.loadingService.hide();
        alert('Sócio cadastrado com sucesso!');
        this.router.navigate(['/dashboard/socios']);
      },
      (error) => {
        this.loadingService.hide();

        if (error.error && error.error.error) {
          alert(`${error.error.error}`);
        } else {
          alert('Erro desconhecido ao cadastrar sócio.');
        }
      }
    );
  }

  applyCpfMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 8) {
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    value = value.substring(0, 14);

    input.value = value;
    this.socio.cpf = value;
  }

  validateCpf(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    if (/^(.)\1+$/.test(cpf)) return false;

    let sum, remainder;
    sum = 0;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

}
