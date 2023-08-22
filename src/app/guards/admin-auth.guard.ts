import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return await this.checkAuth();
  }

  private async unlock() {
    try {
      return await this.checkAuth();
    } catch (error) {
      // you could alert or otherwise set an error message
      // the most common failure is the user cancelling, so we just don't navigate
      console.error(error);
      return this.routeToLogin();
    }
  }

  private async checkAuth() {
    // if(await this.authService.isRefreshTokenAvailable()) {
    //   await this.authService.refreshSession();
    // }
    const authed = await this.authService.isAuthenticated();
    // console.log('********', this.authService.getAuthResponse());
    return authed || this.routeToLogin();
  }

  private routeToLogin(): boolean {
    this.router.navigate([`/landing`]);
    return false;
  }
}
