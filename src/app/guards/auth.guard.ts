import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthenticationService } from '../services/authentication.service';
import { CapacitorVaultService } from '../services/capacitor-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private capacitorVault: CapacitorVaultService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const hasSession = await this.capacitorVault.hasSession();
      if (hasSession) {
        return this.unlock();
      } else {
        return this.routeToLogin();
      }
    } else {
      return await this.checkAuth();
    }
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
    // this.navCtrl.navigateRoot('/landing-page');
    this.router.navigate(['/landing']);
    return false;
  }
}
