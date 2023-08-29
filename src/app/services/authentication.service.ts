import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorVaultService } from './capacitor-vault.service';
import { environment } from 'src/environments/environment';
import { defer, from, switchMap, tap } from 'rxjs';
import { User, UserRole } from 'src/constants/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private capacitorVaultService: CapacitorVaultService,
    private http: HttpClient
  ) {}

  async isAuthenticated() {
    const session = await this.capacitorVaultService.getSession();
    return !!session;
  }

  registerVoluntary(body: {
    email: string;
    name: string;
    birthdate: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
  }) {
    return this.http.post(
      `${environment.apiUrl}/auth/voluntary/register`,
      body
    );
  }

  requestChangePassword(email: string) {
    return this.http.post(
      `${environment.apiUrl}/auth/request-change-password`,
      { email }
    );
  }

  changePassword(body: {
    email: string;
    password: string;
    securityAnswer: string;
  }) {
    return this.http.post(`${environment.apiUrl}/auth/change-password`, body);
  }

  registerAdmin(body: {
    email: string;
    name: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
  }) {
    return this.http.post(`${environment.apiUrl}/auth/admins/register`, body);
  }

  login(body: { email: string; password: string }) {
    return this.http
      .post(`${environment.apiUrl}/auth/login`, body)
      .pipe(
        tap(
          async (response) =>
            await this.capacitorVaultService.setSession(response)
        )
      );
  }

  logout() {
    return this.http
      .post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        switchMap(() =>
          defer(() => from(this.capacitorVaultService.clearSession()))
        )
      );
  }

  getAccessToken() {
    return this.capacitorVaultService.getSession().then((token) => {
      console.log('********* getAccessToken', { token });
      return token.accessToken;
    });
  }

  getCurrentUser(): Promise<User> {
    return this.capacitorVaultService.getSession().then((session) => {
      const user = session.user;
      if (user.role === UserRole.organizationAdmin) {
        user.organizationAdmin = session.organizationAdmin;
      }
      if (user.role === UserRole.voluntary) {
        user.voluntary = session.voluntary;
      }
      return user;
    });
  }
}
