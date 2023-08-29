import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLocaleData } from '@angular/common';
import ptBrLocale from '@angular/common/locales/pt';

registerLocaleData(ptBrLocale, 'pt-BR');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
