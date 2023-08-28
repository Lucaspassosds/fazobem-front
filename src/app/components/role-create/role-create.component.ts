import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { VoluntaryRole } from 'src/constants/interfaces';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss'],
})
export class RoleCreateComponent {
  formGroup: FormGroup;

  roleId: string;

  isReady = false;
  openDropdown = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuider: FormBuilder,
    private adminService: AdminService,
  ) {}

  ngOnInit() {
    this.sharedInfo();
  }

  async sharedInfo() {
    this.roleId = this.route.snapshot.params['roleId'];

    let role: Partial<VoluntaryRole> = {};

    if (this.roleId) {
      const locGet$ = this.adminService.roleGetSingle(this.roleId);
      role = await lastValueFrom(locGet$);
    }
    this.formGroup = this.formBuider.group({
      name: [role.name || '', Validators.required],
      description: [role.description || '', Validators.required],
    });

    this.isReady = true;
  }

  navigateBack() {
    this.router.navigate(['role-list']);
  }

  async submitVoluntaryRole() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.errors || this.formGroup.status !== 'VALID') {
      return;
    }

    const { name, description } = this.formGroup.getRawValue();
    const body = { name, description };

    try {
      if (this.roleId) {
        const roleUpdate$ = this.adminService.roleUpdate(body, this.roleId);
        const updatedRole = await lastValueFrom(roleUpdate$);
      } else {
        const roleCreate$ = this.adminService.roleCreate(body);
        const createdRole = await lastValueFrom(roleCreate$);
      }
      this.router.navigate(['role-list']);
    } catch (err) {
      console.error(err);
      alert('Não foi possível criar o papel.');
    }
  }

  get buttonNaming() {
    return this.roleId ? 'Editar papel' : 'Criar papel';
  }
}
