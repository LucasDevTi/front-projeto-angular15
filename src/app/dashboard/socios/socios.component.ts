import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})


export class SociosComponent implements OnInit {

  socios: any[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSocios();
  }

  getSocios(): void {
    this.loadingService.show();

    this.http.get<any[]>('http://127.0.0.1:8000/api/socios').subscribe(
      data => {
        this.socios = data;
        this.loadingService.hide();
      },
      error => {
        console.error('Erro ao buscar os sócios', error);
        this.loadingService.hide();
      }
    );
  }

  onSocioClick(event: Event, id: number): void {
    event.preventDefault();
    // console.log('ID do sócio:', id); 
    this.router.navigate([`/dashboard/editar-socio/${id}`]);
  }

  onCadastrarClick(): void {
    this.router.navigate(['/dashboard/cadastrar-socio']);
  }
}
