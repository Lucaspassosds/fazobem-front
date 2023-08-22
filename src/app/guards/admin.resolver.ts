import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

/**
 * A resolver that waits for the video details to be fetched before loading the route.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminResolver implements Resolve<boolean> {
  constructor(private router: Router) {}

  /**
   * Run before a view that is using this resolver is entered.
   *
   * @param next Contains the information about a route associated with a component loaded in an outlet at a particular moment in time.
   * @param state Represents the state of the router at a moment in time.
   * @returns Video details corresponding to the given id.
   */
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    //  TODO: Get initial data, then navigate, if fail return to landing
    return new Promise(() => true);
  }
}
