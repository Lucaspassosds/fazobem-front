import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Organization } from 'src/constants/interfaces';
declare var window: any;
@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss'],
})
export class CompanyCreateComponent implements OnInit {
  formGroup: FormGroup;
  modalFormGroup: FormGroup;

  organizationId: string;

  isReady = false;

  adminModal: any;
  displayAdmins: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuider: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.sharedInfo();
  }

  async sharedInfo() {
    this.organizationId = this.route.snapshot.params['organizationId'];

    if (this.organizationId) {
      this.adminModal = new window.bootstrap.Modal(
        document.getElementById('inviteAdminModal')
      );
      const orgGet$ = this.adminService.organizationGetSingle(
        this.organizationId
      );
      const organization: Organization = await lastValueFrom(orgGet$);

      const admins = organization.organizationAdmin;
      this.displayAdmins = admins.map(
        ({ user: { name, email }, isRegistered, id }) => ({
          name: isRegistered ? name : email,
          status: isRegistered
            ? 'Cadastrado na organização'
            : 'Aguardando cadastro',
          isRegistered,
          id,
        })
      );

      this.formGroup = this.formBuider.group({
        name: [organization.name, Validators.required],
      });
    } else {
      this.formGroup = this.formBuider.group({
        name: ['', Validators.required],
      });
    }

    this.modalFormGroup = this.formBuider.group({
      adminEmail: ['', Validators.required],
    });

    this.isReady = true;
  }

  navigateBack() {
    this.router.navigate(['company-list']);
  }

  async submitOrganization() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.errors) {
      return;
    }

    const { name } = this.formGroup.getRawValue();

    try {
      if (this.organizationId) {
        const organizationUpdate$ = this.adminService.organizationUpdate(
          name,
          this.organizationId
        );
        const updatedOrg = await lastValueFrom(organizationUpdate$);
        this.router.navigate(['company-list']);
      } else {
        const organizationCreate$ = this.adminService.organizationCreate(name);
        const createdOrg = await lastValueFrom(organizationCreate$);
        this.router.navigate(['company-create', createdOrg.id]);
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível criar a organização.');
    }
  }

  async inviteAdmin() {
    this.modalFormGroup.markAllAsTouched();
    if (this.modalFormGroup.errors) {
      return;
    }

    const { adminEmail: email } = this.modalFormGroup.getRawValue();
    const { organizationId } = this;

    try {
      const inviteManager$ = this.adminService.inviteOrganizationAdmin({
        email,
        organizationId,
      });
      const managerInvited = await lastValueFrom(inviteManager$);
      this.adminModal.hide();
      this.sharedInfo();
    } catch (err) {
      console.error(err);
      alert('Não foi possível convidar este administrador.');
    }
  }

  async removeAdmin({ rowIndex }: { rowIndex: number }) {
    const admin = this.displayAdmins[rowIndex];

    if (confirm('Tem certeza de que deseja remover este administrador?')) {
      const adminRemoved$ = this.adminService.removeAdmin(admin.id);
      const removeCompleted = await lastValueFrom(adminRemoved$);

      this.sharedInfo();
    }
  }

  get buttonNaming() {
    return this.organizationId ? 'Editar organização' : 'Criar organização';
  }

  openAdminModal() {
    this.adminModal.show();
  }
}
