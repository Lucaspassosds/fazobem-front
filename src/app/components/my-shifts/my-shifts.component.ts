import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Shift } from 'src/constants/interfaces';
import { getFormattedTime } from 'src/utils/utils';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  styleUrls: ['./my-shifts.component.scss'],
})
export class MyShiftsComponent {
  isReady = false;

  shifts: Shift[];

  getFormattedTime = getFormattedTime;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    const user = await this.authService.getCurrentUser();
    const shiftsGet$ = this.adminService.shiftsGetByVoluntary(
      user.voluntary.id
    );
    const shifts = await lastValueFrom(shiftsGet$);

    this.shifts = shifts;

    this.isReady = true;
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }

  navigateToShifts() {
    this.router.navigate(['all-shifts']);
  }

  navigateToShiftDetails(shiftId: string) {
    const shift = this.shifts.find((shft) => shft.id === shiftId);
    this.router.navigate(['shift-details', shiftId], {
      queryParams: { shift: JSON.stringify(shift) },
    });
  }

  checkPastShift(eventDate: string) {
    return DateTime.fromISO(eventDate) <= DateTime.now();
  }
}
