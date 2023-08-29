import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { userRoleNamings } from 'src/constants/constants';
import { User } from 'src/constants/interfaces';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  isReady = false;
  users: User[];
  displayUsers: any[] = [];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    const voluntaryGet$ = this.adminService.usersGet();
    this.users = await lastValueFrom(voluntaryGet$);

    const currentUser = await this.authService.getCurrentUser();

    this.displayUsers = this.users
      .filter((user) => user.id !== currentUser.id)
      .map(({ name, email, autoCreateTs, role, id }) => ({
        name,
        email,
        autoCreateTs:
          DateTime.fromISO(autoCreateTs).toFormat('dd/MM/yyyy HH:mm'),
        role: userRoleNamings[role],
        id,
      }));

    this.isReady = true;
  }

  async removeUser({ rowIndex }: { rowIndex: number }) {
    const user = this.displayUsers[rowIndex];

    if (confirm('Tem certeza de que deseja remover o usuário?')) {
      try {
        const userDelete$ = this.adminService.userRemove(user.id);
        const userDeleted = await lastValueFrom(userDelete$);
        this.sharedInfo();
      } catch (err) {
        console.error(err);
        alert('Não foi possível apagar o usuário.');
      }
    }
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }
}
