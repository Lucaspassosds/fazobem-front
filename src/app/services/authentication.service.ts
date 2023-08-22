import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorVaultService } from './capacitor-vault.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

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

  // TODO: change body, change endpoint
  register(body: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.http.post(
      `${environment.apiUrl}/auth/admins/complete-register`,
      body
    );
  }

  // TODO: change endpoint
  login(body: { email: string; password: string }) {
    return this.http
      .post(`${environment.apiUrl}/auth/admins/login`, body)
      .pipe(
        tap(
          async (response) =>
            await this.capacitorVaultService.setSession(response)
        )
      );
  }

  getAccessToken() {
    return this.capacitorVaultService.getSession().then((token) => {
      console.log('********* getAccessToken', { token });
      return token.accessToken;
    });
  }
}
