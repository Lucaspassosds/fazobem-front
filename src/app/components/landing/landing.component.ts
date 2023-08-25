import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

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
    type: string;
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
          name: 'cpf',
          type: 'text',
          label: 'CPF (Somente números)',
          placeholder: '12345678910',
        },
        {
          name: 'age',
          type: 'number',
          label: 'Idade',
          placeholder: 'Informe sua idade',
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
  };

  loginFormGroup: FormGroup;
  registerVoluntaryFormGroup: FormGroup;
  registerOrganizationFormGroup: FormGroup;
  requestChangePasswordFormGroup: FormGroup;
  changePasswordFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {

    this.registerVoluntaryFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      age: ['', Validators.required],
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
      return this.registerOrganizationFormGroup;
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

  completeRegister(registerType: 'voluntary' | 'admin') {
    alert('I complete registration!');
  }
}
