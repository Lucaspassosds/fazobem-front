import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Shift, Voluntary, VoluntaryShift } from 'src/constants/interfaces';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';
declare var window: any;

@Component({
  selector: 'app-shift-info',
  templateUrl: './shift-info.component.html',
  styleUrls: ['./shift-info.component.scss'],
})
export class ShiftInfoComponent implements OnInit {
  isReady = false;

  receivedData: any;

  inviteVoluntaryModal: any;

  inviteVoluntaryFormGroup: FormGroup;

  openModalDropdown = false;

  voluntaryShifts: VoluntaryShift[];
  voluntaries: Voluntary[];
  shift: Shift;

  displayVoluntaries: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    this.receivedData = this.route.snapshot.queryParams;
    this.shift = JSON.parse(this.receivedData.shift);

    this.inviteVoluntaryModal = new window.bootstrap.Modal(
      document.getElementById('inviteVoluntaryModal')
    );

    this.inviteVoluntaryFormGroup = this.formBuilder.group({
      voluntary: ['', Validators.required],
    });

    const voluntaryShiftsGet$ = this.adminService.voluntaryShiftsGetByShift(
      this.shift.id
    );
    const voluntaryGet$ = this.adminService.voluntariesGet();
    this.voluntaryShifts = await lastValueFrom(voluntaryShiftsGet$);
    this.voluntaries = await lastValueFrom(voluntaryGet$);

    this.displayVoluntaries = this.voluntaryShifts.map(
      ({
        voluntary: {
          user: { name, email },
          id,
        },
        signUpTime,
        confirmTime,
        id: voluntaryShiftId,
      }) => ({
        name,
        email,
        signedUp: this.datePipe.transform(
          signUpTime,
          'medium',
          undefined,
          'pt-BR'
        ),
        confirmed: confirmTime
          ? this.datePipe.transform(confirmTime, 'medium', undefined, 'pt-BR')
          : 'Ainda não confirmou',
        id,
        voluntaryShiftId,
      })
    );

    this.isReady = true;
  }

  async removeVoluntary({ rowIndex }: { rowIndex: number }) {
    const { voluntaryShiftId } = this.displayVoluntaries[rowIndex];

    if (
      confirm('Tem certeza de que deseja remover este usuário desta Tarefa?')
    ) {
      const voluntaryShiftRemove$ =
        this.adminService.voluntaryShiftsDelete(voluntaryShiftId);
      const voluntaryShiftRemoved = await lastValueFrom(voluntaryShiftRemove$);
      this.sharedInfo();
    }
  }

  navigateBack() {
    this.router.navigate(['event-create', this.receivedData.eventId]);
  }

  openModal() {
    this.inviteVoluntaryModal.show();
  }

  async addVoluntary() {
    const { voluntary } = this.inviteVoluntaryFormGroup.getRawValue();

    const voluntaryId = this.voluntaries.find(
      (vol) => vol.user.name === voluntary
    ).id;

    const body = { shiftId: this.shift.id, voluntaryId };

    const voluntaryShiftCreate$ = this.adminService.voluntaryShiftsCreate(body);
    const vountaryShiftCreated = await lastValueFrom(voluntaryShiftCreate$);
    this.inviteVoluntaryModal.hide();
    this.sharedInfo();
  }

  selectItem(item: string, inputName: string): void {
    this.inviteVoluntaryFormGroup.get(inputName).setValue(item);
  }

  get voluntaryOptions() {
    return this.voluntaries
      ?.filter((voluntary) =>
        this.displayVoluntaries.every((dispVol) => dispVol.id !== voluntary.id)
      )
      ?.map((voluntary) => voluntary.user.name);
  }
}
