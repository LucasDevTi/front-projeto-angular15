import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  empresas: any[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEmpresas();
  }

  getEmpresas(): void {
    this.loadingService.show();

    this.http.get<any[]>('http://127.0.0.1:8000/api/empresas').subscribe(
      data => {
        this.empresas = data;
        this.loadingService.hide();
      },
      error => {
        console.error('Erro ao buscar as empresas', error);
        this.loadingService.hide();
      }
    );
  }

  onEmpresaClick(event: Event, id: number): void {
    event.preventDefault();
    // console.log('ID da empresa clicada:', id); 
    this.router.navigate([`/dashboard/editar-empresa/${id}`]);
  }

  onCadastrarClick(): void {
    this.router.navigate(['/dashboard/cadastrar-empresa']);
  }
}
