import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Shift, User } from 'src/constants/interfaces';
import { formatAddress, getFormattedTime } from 'src/utils/utils';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-shift-details',
  templateUrl: './shift-details.component.html',
  styleUrls: ['./shift-details.component.scss'],
})
export class ShiftDetailsComponent implements OnInit {
  isReady = false;

  shift: Shift;
  user: User;

  getFormattedTime = getFormattedTime;
  getFormattedAddress = formatAddress;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    const shift = this.route.snapshot.queryParams['shift'];

    if (shift) {
      this.shift = JSON.parse(shift);
    }

    console.log(this.shift);

    this.user = await this.authService.getCurrentUser();

    this.shift.voluntaryShift = this.shift.voluntaryShift.filter(
      (volShift) => volShift.voluntary.id === this.user.voluntary.id
    );

    this.isReady = true;
  }

  navigateBack() {
    this.location.back();
  }

  async signUpToShift() {
    const body = {
      shiftId: this.shift.id,
      voluntaryId: this.user.voluntary.id,
    };

    const signUp$ = this.adminService.voluntaryShiftsCreate(body);
    const signedUp = await lastValueFrom(signUp$);
    this.shift.voluntaryShift = [signedUp];
    this.router.navigate(['shift-details', this.shift.id], {
      queryParams: { shift: JSON.stringify(signedUp) },
    });
  }

  async confirmShift() {
    const body = {
      shiftId: this.shift.id,
      voluntaryId: this.user.voluntary.id,
    };

    const confirm$ = this.adminService.voluntaryShiftsConfirm(body);
    const confirmed = await lastValueFrom(confirm$);
    this.shift.voluntaryShift = [confirmed];
    this.router.navigate(['shift-details', this.shift.id], {
      queryParams: { shift: JSON.stringify(confirmed) },
    });
  }

  async cancelShift() {
    const [voluntaryShift] = this.shift.voluntaryShift;

    if (voluntaryShift.isConfirmed) {
      if (
        !confirm(
          'ATENÇÃO: Você já está confirmado para esta Tarefa. Os participantes do evento podem estar dependendo de você! Tem certeza de que deseja cancelar?'
        )
      ) {
        return;
      }
    } else {
      if (!confirm('Tem certeza de que deseja cancelar?')) {
        return;
      }
    }

    const canceled$ = this.adminService.voluntaryShiftsDelete(
      voluntaryShift.id
    );
    const canceled = await lastValueFrom(canceled$);

    this.router.navigate(['all-shifts']);
  }

  get buttonNaming() {
    const { eventDate } = this.shift.organizationEvent;
    const inputDate = DateTime.fromISO(eventDate);

    const currentDateTime = DateTime.now();
    const futureDateTime = currentDateTime.plus({ hours: 48 });
    return this.shift.voluntaryShift[0] &&
      inputDate >= currentDateTime &&
      inputDate <= futureDateTime
      ? this.shift.voluntaryShift[0].isConfirmed
        ? 'Confirmado'
        : 'Confirmar'
      : this.shift.voluntaryShift[0]?.signUpTime
      ? 'Inscrito'
      : 'Inscrever';
  }

  get buttonDisabled() {
    const { eventDate } = this.shift.organizationEvent;
    const inputDate = DateTime.fromISO(eventDate);

    const currentDateTime = DateTime.now();
    const futureDateTime = currentDateTime.plus({ hours: 48 });
    return this.shift.voluntaryShift[0] &&
      inputDate >= currentDateTime &&
      inputDate <= futureDateTime
      ? this.shift.voluntaryShift[0].isConfirmed
        ? true
        : false
      : this.shift.voluntaryShift[0]?.signUpTime
      ? true
      : false;
  }

  get buttonCallback() {
    const { eventDate } = this.shift.organizationEvent;
    const inputDate = DateTime.fromISO(eventDate);

    const currentDateTime = DateTime.now();
    const futureDateTime = currentDateTime.plus({ hours: 48 });
    return this.shift.voluntaryShift[0] &&
      inputDate >= currentDateTime &&
      inputDate <= futureDateTime
      ? () => this.confirmShift()
      : () => this.signUpToShift();
  }
}
