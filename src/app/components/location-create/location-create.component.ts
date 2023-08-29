import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { brazilStates } from 'src/constants/constants';
import { Location } from 'src/constants/interfaces';

@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.scss'],
})
export class LocationCreateComponent {
  formGroup: FormGroup;

  locationId: string;

  isReady = false;
  openDropdown = false;

  brazilStates = brazilStates;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuider: FormBuilder,
    private adminService: AdminService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.sharedInfo();
  }

  async sharedInfo() {
    this.locationId = this.route.snapshot.params['locationId'];

    let location: Partial<Location> = {};

    if (this.locationId) {
      const locGet$ = this.adminService.locationGetSingle(this.locationId);
      location = await lastValueFrom(locGet$);
    }
    this.formGroup = this.formBuider.group({
      name: [location.name || '', Validators.required],
      addressLine1: [location.addressLine1 || '', Validators.required],
      addressLine2: [location.addressLine2 || '', Validators.required],
      city: [location.city || '', Validators.required],
      state: [location.state || '', Validators.required],
      description: [location.description || '', Validators.required],
    });

    this.isReady = true;
  }

  navigateBack() {
    this.router.navigate(['location-list']);
  }

  async submitLocation() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.errors || this.formGroup.status !== 'VALID') {
      return;
    }

    const { name, addressLine1, addressLine2, city, state, description } =
      this.formGroup.getRawValue();
    const user = await this.authService.getCurrentUser();
    const organizationId = user.organizationAdmin.organizationId;
    const body = { name, addressLine1, addressLine2, city, state, description, organizationId };

    try {
      if (this.locationId) {
        const locationUpdate$ = this.adminService.locationUpdate(
          body,
          this.locationId
        );
        const updatedLoc = await lastValueFrom(locationUpdate$);
      } else {
        const locationCreate$ = this.adminService.locationCreate(body);
        const createdLoc = await lastValueFrom(locationCreate$);
      }
      this.router.navigate(['location-list']);
    } catch (err) {
      console.error(err);
      alert('Não foi possível criar a localidade.');
    }
  }

  get buttonNaming() {
    return this.locationId ? 'Editar localidade' : 'Criar localidade';
  }

  selectItem(item: string, inputName: string): void {
    this.formGroup.get(inputName).setValue(item);
  }
}
