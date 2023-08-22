import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

type InputType =
  | 'text'
  | 'password'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'email'
  | 'file'
  | 'hidden';

interface LandingStage {
  text?: {
    content: string;
    classes?: string[];
    actionName?: string;
    callback?: () => void;
  }[];
  inputs?: {
    label: string;
    name: string;
    type: InputType;
    placeholder?: string;
  }[];
  buttons?: {
    text: string;
    classes?: string[];
    callback: () => void;
  }[];
  footer?: {
    content: string;
    classes?: string[];
    actionName?: string;
    callback?: () => void;
  }[];
}

type stage =
  | 'landing'
  | 'login'
  | 'register-start'
  | 'register-form-voluntary'
  | 'register-form-admin'
  | 'forgot-password'
  | 'change-password';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  currentStage: stage = 'landing';

  stages: Record<string, LandingStage> = {
    landing: {
      text: [],
      buttons: [
        {
          text: 'Entrar',
          callback: () => this.changeStage('login'),
          classes: ['landing-button'],
        },
        {
          text: 'Registrar',
          callback: () => this.changeStage('register-start'),
          classes: ['landing-button'],
        },
      ],
    },
    login: {
      text: [],
      inputs: [
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'joao@exemplo.com',
        },
        {
          name: 'password',
          type: 'password',
          label: 'Informe sua senha',
          placeholder: '12345678',
        },
      ],
      buttons: [
        {
          text: 'Login',
          callback: () => this.login(),
          classes: ['landing-button'],
        },
      ],
      footer: [
        {
          content: '',
          actionName: 'Voltar',
          callback: () => this.changeStage('landing'),
        },
      ],
    },
    'register-start': {
      text: [
        {
          content: 'Que bom que chegou até aqui! Primeiramente, você é...',
        },
      ],
      buttons: [
        {
          text: 'Voluntário',
          callback: () => this.changeStage('register-form-voluntary'),
          classes: ['landing-button'],
        },
        {
          text: 'Organização',
          callback: () => this.changeStage('register-form-admin'),
          classes: ['landing-button'],
        },
      ],
      footer: [
        {
          content: '',
          actionName: 'Voltar',
          callback: () => this.changeStage('landing'),
        },
      ],
    },
    'register-form-voluntary': {
      text: [
        {
          content:
            'Muito feliz em saber que você também está disposto em fazer a diferença! Por favor, informe os dados a seguir...',
        },
      ],
      inputs: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome completo',
          placeholder: 'Ex.: João da Silva',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'joao@exemplo.com',
        },
        {
          name: 'birthdate',
          type: 'date',
          label: 'Data de nascimento',
          placeholder: 'DD/MM/AAAA',
        },
        {
          name: 'password',
          type: 'password',
          label: 'Crie uma senha',
          placeholder: '12345678',
        },
        {
          name: 'confirmPassword',
          type: 'password',
          label: 'Confirme sua senha',
          placeholder: '12345678',
        },
      ],
      buttons: [
        {
          text: 'Cadastrar',
          callback: () => this.completeRegister('voluntary'),
          classes: ['landing-button'],
        },
      ],
      footer: [
        {
          content: '',
          actionName: 'Voltar',
          callback: () => this.changeStage('register-start'),
        },
      ],
    },
    'register-form-admin': {
      text: [
        {
          content:
            'Caso já tenha sido liberado pelo Administrador do Sistema, por favor informe os dados a seguir para completar seu cadastro.',
        },
      ],
      inputs: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome completo',
          placeholder: 'Ex.: João da Silva',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'joao@exemplo.com',
        },
        {
          name: 'password',
          type: 'password',
          label: 'Crie uma senha',
          placeholder: '12345678',
        },
        {
          name: 'confirmPassword',
          type: 'password',
          label: 'Confirme sua senha',
          placeholder: '12345678',
        },
      ],
      buttons: [
        {
          text: 'Cadastrar',
          callback: () => this.completeRegister('admin'),
          classes: ['landing-button'],
        },
      ],
      footer: [
        {
          content:
            'Se não está conseguindo se cadastrar, por favor contate o Administrator do Sistema para solicitar a sua liberação.',
        },
        {
          content: '',
          actionName: 'Voltar',
          callback: () => this.changeStage('register-start'),
        },
      ],
    },
  };

  loginFormGroup: FormGroup;
  registerVoluntaryFormGroup: FormGroup;
  registerAdminFormGroup: FormGroup;
  requestChangePasswordFormGroup: FormGroup;
  changePasswordFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.registerVoluntaryFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        birthdate: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.registerAdminFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  changeStage(nextStage: stage) {
    this.currentStage = nextStage;
  }

  get stage() {
    return this.stages[this.currentStage];
  }

  get formGroup(): FormGroup {
    const { currentStage } = this;
    if (currentStage === 'login') {
      return this.loginFormGroup;
    }
    if (currentStage === 'register-form-voluntary') {
      return this.registerVoluntaryFormGroup;
    }
    if (currentStage === 'register-form-admin') {
      return this.registerAdminFormGroup;
    }
    if (currentStage === 'forgot-password') {
      return this.requestChangePasswordFormGroup;
    }
    if (currentStage === 'change-password') {
      return this.changePasswordFormGroup;
    } else {
      return this.formBuilder.group({});
    }
  }

  async completeRegister(registerType: 'voluntary' | 'admin') {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    const { name, email, birthdate, password } = this.formGroup.getRawValue();
    if (registerType === 'voluntary') {
      const register$ = this.authService.registerVoluntary({
        name,
        email,
        birthdate,
        password,
      });
      const registrationFinish = await lastValueFrom(register$);
      console.log({ registrationFinish });
    }

    this.changeStage('login');
  }

  async login() {
    alert('I login!');
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
