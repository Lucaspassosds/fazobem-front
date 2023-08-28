import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import {
  Location,
  OrganizationEvent,
  Shift,
  VoluntaryRole,
} from 'src/constants/interfaces';
declare var window: any;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent {
  formGroup: FormGroup;
  modalFormGroup: FormGroup;

  eventId: string;
  event: OrganizationEvent;

  isReady = false;
  openDropdown = false;
  openModalDropdown = false;

  isPublished = false;

  locations: Location[];
  roles: VoluntaryRole[];

  shiftsModal: any;

  displayShifts: any[];

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
    this.eventId = this.route.snapshot.params['eventId'];

    let event: Partial<OrganizationEvent> = {};
    let shift: Partial<Shift> = {};

    const locationGet$ = this.adminService.locationsGet();
    this.locations = await lastValueFrom(locationGet$);
    const rolesGet$ = this.adminService.rolesGet();
    this.roles = await lastValueFrom(rolesGet$);

    if (this.eventId) {
      this.shiftsModal = new window.bootstrap.Modal(
        document.getElementById('shiftsModal')
      );
      const eventGet$ = this.adminService.eventGetSingle(this.eventId);
      event = await lastValueFrom(eventGet$);
      this.event = event as OrganizationEvent;
      this.isPublished = event.isPublished;

      this.displayShifts = event.shifts.map((shift) => ({
        voluntaryRole: shift.voluntaryRole.name,
        startTime: DateTime.fromFormat(shift.startTime, 'HH:mm:ss').toFormat(
          'HH:mm'
        ),
        endTime: DateTime.fromFormat(shift.endTime, 'HH:mm:ss').toFormat(
          'HH:mm'
        ),
        positionsFilled: `${shift.voluntaryShift.length}/${shift.quantityNeeded}`,
      }));
    }
    this.formGroup = this.formBuider.group({
      name: [event.name || '', Validators.required],
      eventDate: [event.eventDate || '', Validators.required],
      description: [event.description || '', Validators.required],
      location: [event.location?.name || '', Validators.required],
    });

    this.modalFormGroup = this.formBuider.group({
      voluntaryRole: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      quantityNeeded: ['', Validators.required],
      staffingManagerName: ['', Validators.required],
      staffingManagerPhoneNumber: ['', Validators.required],
      staffingManagerEmail: ['', [Validators.required, Validators.email]],
      jobRequirements: ['', Validators.required],
      otherInfo: ['', Validators.required],
    });

    this.isReady = true;
  }

  async publishEvent() {
    const publishEvent$ = this.adminService.publishEvent(this.eventId);
    const eventPublished = await lastValueFrom(publishEvent$);
    this.sharedInfo();
  }

  navigateBack() {
    this.router.navigate(['event-list']);
  }

  async submitOrganizationEvent() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.errors || this.formGroup.status !== 'VALID') {
      return;
    }

    const {
      name,
      description,
      eventDate,
      location: locationName,
    } = this.formGroup.getRawValue();
    const location = this.locations.find((loc) => loc.name === locationName);
    const body = {
      name,
      description,
      eventDate,
      locationId: location.id,
      isPublished: this.isPublished,
    };

    try {
      if (this.eventId) {
        const eventUpdate$ = this.adminService.eventUpdate(body, this.eventId);
        const updatedLoc = await lastValueFrom(eventUpdate$);
        this.router.navigate(['event-list']);
      } else {
        const eventCreate$ = this.adminService.eventCreate(body);
        const createdLoc = await lastValueFrom(eventCreate$);
        this.router.navigate(['event-create', createdLoc.id]);
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível criar o evento.');
    }
  }

  async submitShift() {
    this.modalFormGroup.markAllAsTouched();
    if (this.modalFormGroup.errors || this.modalFormGroup.status !== 'VALID') {
      return;
    }

    const {
      startTime,
      endTime,
      quantityNeeded,
      staffingManagerName,
      staffingManagerEmail,
      staffingManagerPhoneNumber,
      jobRequirements,
      otherInfo,
      voluntaryRole: roleName,
    } = this.modalFormGroup.getRawValue();
    const voluntaryRole = this.roles.find((role) => role.name === roleName);

    const body = {
      startTime,
      endTime,
      quantityNeeded,
      staffingManagerName,
      staffingManagerEmail,
      staffingManagerPhoneNumber,
      jobRequirements,
      otherInfo,
      voluntaryRoleId: voluntaryRole.id,
      organizationEventId: this.eventId,
    };

    try {
      const shiftCreate$ = this.adminService.shiftCreate(body);
      const shiftCreated = await lastValueFrom(shiftCreate$);
      this.shiftsModal.hide();
      this.sharedInfo();
    } catch (err) {
      console.error(err);
      alert('Não foi possível criar a tarefa.');
    }
  }

  async removeShift({ rowIndex }: { rowIndex: number }) {
    const shift = this.displayShifts[rowIndex];

    if (confirm('Tem certeza de que deseja remover esta tarefa?')) {
      const shiftRemoved$ = this.adminService.shiftDelete(shift.id);
      const removeCompleted = await lastValueFrom(shiftRemoved$);

      this.sharedInfo();
    }
  }

  get buttonNaming() {
    return this.eventId ? 'Editar evento' : 'Criar evento';
  }

  get publishButtonNaming() {
    return this.eventId ? 'Editar evento' : 'Criar evento';
  }

  selectItem(item: string, inputName: string, fromModal = false): void {
    if (fromModal) {
      this.modalFormGroup.get(inputName).setValue(item);
    } else {
      this.formGroup.get(inputName).setValue(item);
    }
  }

  get locationOptions() {
    return this.locations.map((location) => location.name);
  }

  get roleOptions() {
    return this.roles.map((role) => role.name);
  }

  openModal() {
    this.shiftsModal.show();
  }

  get checkButtonDisabled() {
    return this.event?.shifts?.length === 0 || this.event?.isPublished;
  }
}
