import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from '../../loading.service';

@Component({
  selector: 'app-cadastrar-empresa',
  templateUrl: './cadastrar-empresa.component.html',
  styleUrls: ['./cadastrar-empresa.component.css'],
})
export class CadastrarEmpresaComponent {
  empresa = { nome: '', cnpj: '' };

  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService
  ) { }

  onSubmit(): void {

    if (!this.validateCnpj(this.empresa.cnpj)) {
      alert('CNPJ inválido! Por favor, insira um CNPJ válido.');
      return;
    }

    this.loadingService.show();
    const url = 'http://127.0.0.1:8000/api/empresa/create';
    this.http.post(url, this.empresa).subscribe(
      (response) => {
        this.loadingService.hide();
        alert('Empresa cadastrada com sucesso!');
        this.router.navigate(['/dashboard/empresa']);
      },
      (error) => {
        this.loadingService.hide();

        if (error.error && error.error.error) {
          alert(`${error.error.error}`);
        } else {
          alert('Erro desconhecido ao cadastrar empresa.');
        }
      }
    );
  }

  applyCnpjMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 8) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    }
    if (value.length > 12) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
    }

    value = value.substring(0, 18);

    input.value = value;
    this.empresa.cnpj = value;
  }

  validateCnpj(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14) return false;

    if (/^(.)\1+$/.test(cnpj)) return false;

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length += 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }


}
