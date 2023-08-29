import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Shift } from 'src/constants/interfaces';
import { getFormattedTime } from 'src/utils/utils';

@Component({
  selector: 'app-all-shifts',
  templateUrl: './all-shifts.component.html',
  styleUrls: ['./all-shifts.component.scss'],
})
export class AllShiftsComponent implements OnInit {
  isReady = false;

  shifts: Shift[];

  getFormattedTime = getFormattedTime;

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    const shiftsGet$ = this.adminService.shiftsGet(true);
    const shifts = await lastValueFrom(shiftsGet$);

    this.shifts = shifts.filter(
      (shift) =>
        DateTime.fromISO(shift.organizationEvent.eventDate) >= DateTime.now()
    );

    this.isReady = true;
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }
}
