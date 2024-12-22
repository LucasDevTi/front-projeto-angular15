import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarSocioComponent } from './cadastrar-socio.component';

describe('CadastrarSocioComponent', () => {
  let component: CadastrarSocioComponent;
  let fixture: ComponentFixture<CadastrarSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
