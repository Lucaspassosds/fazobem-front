import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Voluntary } from 'src/constants/interfaces';

@Component({
  selector: 'app-voluntary-list',
  templateUrl: './voluntary-list.component.html',
  styleUrls: ['./voluntary-list.component.scss'],
})
export class VoluntaryListComponent implements OnInit {
  isReady = false;
  voluntaries: Voluntary[];
  displayVoluntaries: any[] = [];

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  async sharedInfo() {
    const voluntaryGet$ = this.adminService.voluntariesGet();
    this.voluntaries = await lastValueFrom(voluntaryGet$);

    this.displayVoluntaries = this.voluntaries.map(
      ({ user: { name, email }, id, autoCreateTs, voluntaryShift }) => ({
        name,
        email,
        autoCreateTs:
          DateTime.fromISO(autoCreateTs).toFormat('dd/MM/yyyy HH:mm'),
        totalShifts: voluntaryShift.length,
        id,
      })
    );

    this.isReady = true;
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }
}
