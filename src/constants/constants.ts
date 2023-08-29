import { UserRole } from './interfaces';

export const securityQuestions = [
  'Qual é o nome da sua mãe?',
  'Qual é o nome do seu animal de estimação de infância?',
  'Qual é a sua cor favorita?',
  'Qual é o nome da cidade em que você nasceu?',
  'Qual é o nome do seu melhor amigo de infância?',
  'Qual é o nome do seu professor favorito?',
  'Qual é o nome do seu livro favorito?',
  'Qual é o seu prato de comida favorito?',
  'Qual é o nome da sua primeira escola?',
  'Qual é o nome do seu avô ou avó?',
];

export const brazilStates: string[] = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export const userRoleNamings: Record<UserRole, string> = {
  [UserRole.noRole]: 'Sem tipo',
  [UserRole.organizationAdmin]: 'Administrador de Organização',
  [UserRole.systemAdmin]: 'Administrador do Sistema',
  [UserRole.voluntary]: 'Voluntário',
};
