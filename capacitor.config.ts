import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fazobem.app',
  appName: 'fazobem-front',
  webDir: 'dist/fazobem-front',
  server: {
    androidScheme: 'https'
  }
};

export default config;
