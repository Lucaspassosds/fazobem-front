import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { OrganizationEvent } from 'src/constants/interfaces';
import { formatAddress } from 'src/utils/utils';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {
  isReady = false;

  displayEvents: any[] = [];

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  sharedInfo() {
    this.displayEvents = [];
    const calls = [this.adminService.eventsGet()];

    forkJoin(calls)
      .toPromise()
      .then((result: any[]) => {
        const events = result[0] as OrganizationEvent[];
        console.log(events);

        this.displayEvents = events.map((event) => ({
          eventId: event.id,
          name: event.name,
          address: formatAddress(event.location),
          eventDate: DateTime.fromISO(event.eventDate).toFormat('dd/MM/yyyy'),
          isPublished: event.isPublished ? 'Sim' : 'Não',
          description: event.description,
        }));
        this.isReady = true;
      });
  }

  navigateToEventCreate() {
    this.router.navigate(['event-create']);
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }

  async deleteEvent({ rowIndex }: { rowIndex: number }) {
    const { eventId } = this.displayEvents[rowIndex];

    if (confirm('Tem certeza de que quer remover este evento?')) {
      const deleteOrg$ = this.adminService.eventDelete(eventId);
      await lastValueFrom(deleteOrg$);
      this.sharedInfo();
    }
  }
}
