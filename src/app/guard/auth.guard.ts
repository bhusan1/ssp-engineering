import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot) {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      // check if the route is retricted by role
      if (next.data.roles && next.data.roles.indexOf(currentUser.role) === -1) {
        // role not authorized
        this.router.navigate(['/login']);
        return false;
      }
      else {
        return true;
      }
    }
    return true;
  }
}
