import { Injectable } from '@angular/core';
import { User } from 'src/constants/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  currentUser: User;

  constructor() { }
}
