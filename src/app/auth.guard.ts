import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    const token = localStorage.getItem('jwt'); 
    if (!token) {
     
      this.router.navigate(['/login']);
      return false;
    }
    
    if (!this.authService.isTokenValid(token)) {

      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}
