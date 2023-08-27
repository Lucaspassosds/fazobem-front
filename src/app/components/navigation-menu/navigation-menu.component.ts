import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) {

  }

  async ngOnInit() {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['']);
    }
  }

}
