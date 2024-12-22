import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../loading.service';

@Component({
  selector: 'app-editar-socio',
  templateUrl: './editar-socio.component.html',
  styleUrls: ['./editar-socio.component.css']
})
export class EditarSocioComponent implements OnInit {

  socioForm: FormGroup;
  socioId: number | null = null;
  empresas: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.socioForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      empresa_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.socioId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSocioData();
    this.loadEmpresas();
  }

  loadSocioData(): void {
    this.loadingService.show();

    const url = `http://127.0.0.1:8000/api/socio/${this.socioId}`;
    this.http.get<any>(url).subscribe(
      (response) => {
        console.log('Dados do Sócio:', response);
        this.socioForm.patchValue({
          nome: response.nome,
          cpf: response.cpf,
          empresa_id: response.empresa.id
        });

        this.loadingService.hide();
      },
      (error) => {
        this.loadingService.hide();
        if (error.error && error.error.error) {
          alert(`${error.error.error}`);
        } else {
          alert('Erro desconhecido ao carregar os dados do sócio.');
        }
      }
    );
  }


  loadEmpresas(): void {
    this.loadingService.show();
    const url = 'http://127.0.0.1:8000/api/empresas';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.empresas = response;
      },
      (error) => {
        if (error.error && error.error.error) {
          this.loadingService.hide();
          alert(`${error.error.error}`);
        } else {
          this.loadingService.hide();
          alert('Erro ao carregar as empresas.');
        }
      }
    );
    this.loadingService.hide();

  }

  onSubmit(): void {

    if (!this.validateCpf(this.socioForm.value.cpf)) {
      alert('CPF inválido! Por favor, insira um CPF válido.');
      return;
    }

    this.loadingService.show();
    const url = `http://127.0.0.1:8000/api/socio/${this.socioId}`;
    const payload = {
      nome: this.socioForm.value.nome,
      cpf: this.socioForm.value.cpf.replace(/[^\d]/g, ''),
      empresa_id: this.socioForm.value.empresa_id
    };

    this.http.put(url, payload).subscribe(
      (response) => {
        alert('Sócio atualizado com sucesso!');
        this.router.navigate(['/dashboard/socios']);
      },
      (error) => {
        this.loadingService.hide();
        if (error.error && error.error.error) {
          alert(`${error.error.error}`);
        } else {
          alert('Erro desconhecido ao atualizar os dados do sócio.');
        }
      }
    );
    this.loadingService.hide();
  }

  onDelete(): void {
    this.loadingService.show();
    const url = `http://127.0.0.1:8000/api/socio/${this.socioId}`;
    if (confirm('Você tem certeza que deseja excluir este sócio?')) {
      this.http.delete(url).subscribe(
        (response) => {
          alert('Sócio excluído com sucesso!');
          this.router.navigate(['/dashboard/socio']);
        },
        (error) => {
          this.loadingService.hide();
          if (error.error && error.error.error) {
            alert(`${error.error.error}`);
          } else {
            alert('Erro desconhecido ao deletar o sócio.');
          }
        }
      );
    }
    this.loadingService.hide();
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
    this.socioForm.get('cpf')?.setValue(value);
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
