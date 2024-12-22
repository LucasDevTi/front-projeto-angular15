import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.component.html',
  styleUrls: ['./editar-empresa.component.css'],
})
export class EditarEmpresaComponent implements OnInit {

  empresaForm: FormGroup;
  empresaId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.empresaForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]], // Validação para CNPJ
    });
  }

  ngOnInit(): void {
    this.empresaId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEmpresaData();
  }

  loadEmpresaData(): void {
    this.loadingService.show();

    const url = `http://127.0.0.1:8000/api/empresa/${this.empresaId}`;
    this.http.get<any>(url).subscribe(
      (response) => {
        this.empresaForm.patchValue({
          nome: response.nome,
          cnpj: response.cnpj,
        });

        this.loadingService.hide();
      },
      (error) => {
        this.loadingService.hide();
        if (error.error && error.error.error) {
          alert(`${error.error.error}`);
        } else {
          alert('Erro desconhecido ao carregar os dados da empresa.');
        }
      }
    );
  }

  onSubmit(): void {

    if (!this.validateCnpj(this.empresaForm.value.cnpj)) {
      alert('CNPJ inválido! Por favor, insira um CNPJ válido.');
      return;
    }

    this.loadingService.show();
    const url = `http://127.0.0.1:8000/api/empresa/${this.empresaId}`;
    const payload = {
      nome: this.empresaForm.value.nome,
      cnpj: this.empresaForm.value.cnpj.replace(/[^\d]/g, ''),
    };

    this.http.put(url, payload).subscribe(
      (response) => {
        alert('Empresa atualizada com sucesso!');
        this.router.navigate(['/dashboard/empresa']);
      },
      (error) => {
        this.loadingService.hide();
        if (error.error && error.error.error) {
          alert(`${error.error.error}`);
        } else {
          alert('Erro desconhecido ao atualizar os dados da empresa.');
        }
      }
    );
    this.loadingService.hide();
  }

  onDelete(): void {
    this.loadingService.show();
    const url = `http://127.0.0.1:8000/api/empresa/${this.empresaId}`;
    if (confirm('Você tem certeza que deseja excluir esta empresa?')) {
      this.http.delete(url).subscribe(
        (response) => {
          alert('Empresa excluída com sucesso!');
          this.router.navigate(['/dashboard/empresa']);
        },
        (error) => {
          this.loadingService.hide();
          if (error.error && error.error.error) {
            alert(`${error.error.error}`);
          } else {
            alert('Erro desconhecido ao deletar a empresa.');
          }
        }
      );
    }
    this.loadingService.hide();
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
    this.empresaForm.get('cnpj')?.setValue(value);
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
