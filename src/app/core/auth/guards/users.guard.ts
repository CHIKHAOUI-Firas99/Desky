import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleService } from 'app/core/role/role.service';


@Injectable({
  providedIn: 'root'
})


@Injectable({
    providedIn: 'root'
})
export class UsersAuthGuard implements CanActivate {

  constructor(private _roleService: RoleService, private _router: Router,private _authService:AuthService) {}

  roles:any=[]
  user:any
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      // Get the list of roles from the service
      const roles = await this._roleService.getAll().toPromise();
      console.log(roles);
  
      // Get the current user from the authentication service
      this.user = this._authService.getCurrentUser();
    
  
      // Find the role that matches the user's role ID
      const role = roles.find(r => r.id === this.user.role_id);
      console.log(role);
  
      // If the role doesn't have any claims, deny access to the route
      if (!role || !role.claims) {
        console.log('User is not authorized to access the route - no claims');
        this._router.navigate(['/login']);
        return false;
      }
  
      // Find the "adminmap" claim for the role
      const adminmapClaim = role.claims.find(c => c['object'] === 'users');
  console.log(adminmapClaim);
  
      // If the "adminmap" claim doesn't exist or doesn't have "r" rights, deny access to the route
      if (!adminmapClaim || !adminmapClaim['rights'].includes('r')) {
        console.log('User is not authorized to access the route - insufficient rights');
        this._router.navigate([this._router.url]);
        return false;
      }
  
      // If the user is authorized, allow access to the route
      console.log('User is authorized to access the route');
      return true;
  
    } catch (err) {
      // Handle errors thrown by the service or authentication
      console.error('Error checking authorization:', err);
      this._router.navigate([this._router.url]);

      return false;
    }
   
  }
  }