import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class CapacitorVaultService {
  constructor() {}

  // JSON "set" example
  async setSession(session: any) {
    await Preferences.set({
      key: 'session',
      value: JSON.stringify(session),
    });
  }

  async clearSession() {
    await Preferences.clear();
  }

  async hasSession() {
    try {
      const ret = await Preferences.get({ key: 'session' });
      return !!ret;
    } catch (e) {
      return false;
    }
  }

  async getSession() {
    const ret = await Preferences.get({ key: 'session' });
    const userSession = JSON.parse(ret.value as string);
    return userSession;
  }
}
