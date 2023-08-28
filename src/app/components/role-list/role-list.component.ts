import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { VoluntaryRole } from 'src/constants/interfaces';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent {
  isReady = false;

  displayRoles: any[] = [];

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  sharedInfo() {
    this.displayRoles = [];
    const calls = [this.adminService.rolesGet()];

    forkJoin(calls)
      .toPromise()
      .then((result: any[]) => {
        const roles = result[0] as VoluntaryRole[];
        console.log(roles);

        this.displayRoles = roles.map((role) => ({
          roleId: role.id,
          name: role.name,
          description: role.description,
        }));
        this.isReady = true;
      });
  }

  navigateToRoleCreate() {
    this.router.navigate(['role-create']);
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }

  async deleteRole({ rowIndex }: { rowIndex: number }) {
    const { roleId } = this.displayRoles[rowIndex];

    if (confirm('Tem certeza de que quer remover este papel?')) {
      const deleteRole$ = this.adminService.roleDelete(roleId);
      await lastValueFrom(deleteRole$);
      this.sharedInfo();
    }
  }
}
