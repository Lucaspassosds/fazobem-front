import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom, retry } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/constants/interfaces';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  isReady = false;

  user: User;

  formGroup: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    this.user = await this.authService.getCurrentUser();

    const {
      user: {
        email,
        voluntary: { birthdate },
      },
    } = this;

    this.formGroup = this.formBuilder.group(
      {
        email: [email || '', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );

    this.isReady = true;
  }

  async updateUser() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.errors || this.formGroup.status !== 'VALID') {
      return;
    }

    if (
      !confirm(
        'Tem certeza de que deseja atualizar seu perfil? Você precisará realizar login novamente após a atualização.'
      )
    ) {
      return;
    }

    const { email, password } = this.formGroup.getRawValue();

    const body: any = { email };

    if (password) {
      body.password = password;
    }

    try {
      const userUpdate$ = this.adminService.userUpdate(body, this.user.id);
      const userUpdated = await lastValueFrom(userUpdate$);
      alert('Perfil atualizado com sucesso!');
      this.authService
        .logout()
        .toPromise()
        .then(() => {
          this.router.navigate(['']);
        })
        .catch((error: any) => {
          throw new Error(error);
        });
    } catch (err) {
      console.error(err);
      alert(
        'Não foi possível atualizar o seu perfil no momento. Tente novamente mais tarde.'
      );
    }
  }

  async deleteAccount() {
    this.formGroup.markAllAsTouched();
    const { password, confirmPassword } = this.formGroup.getRawValue();
    if (!password) {
      alert('Esta ação requer que você digite sua senha no campo indicado.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Confirme a senha.');
      return;
    }
    if (this.formGroup.errors || this.formGroup.status !== 'VALID') {
      return;
    }
    if (
      confirm(
        'ATENÇÃO: Esta ação irá deletar permanentemente sua conta. Tem certeza de que deseja continuar?'
      )
    ) {
      try {
        const accountDelete$ = this.adminService.userRemove(this.user.id);
        const accountDeleted = await lastValueFrom(accountDelete$);
        this.authService.clearSession();
        this.router.navigate(['']);
      } catch (err) {
        console.error(err);
        alert(
          'Não foi possível realizar esta ação no momento. Tente novamente mais tarde.'
        );
      }
    }
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
