import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from 'src/constants/interfaces';
import { formatAddress } from 'src/utils/utils';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  isReady = false;

  displayLocations: any[] = [];

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  sharedInfo() {
    this.displayLocations = [];
    const calls = [this.adminService.locationsGet()];

    forkJoin(calls)
      .toPromise()
      .then((result: any[]) => {
        const locations = result[0] as Location[];
        console.log(locations);

        this.displayLocations = locations.map((location) => ({
          locationId: location.id,
          name: location.name,
          address: formatAddress(location),
          description: location.description,
          events: location.organizationEvents,
        }));
        this.isReady = true;
      });
  }

  navigateToLocationCreate() {
    this.router.navigate(['location-create']);
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }

  async deleteLocation({ rowIndex }: { rowIndex: number }) {
    const { locationId, events } = this.displayLocations[rowIndex];

    if (events.length) {
      alert(
        'Não é possível remover esta localidade pois ela já possui eventos cadastrados. Por favor, remova os eventos primeiro.'
      );
      return;
    }

    if (confirm('Tem certeza de que quer remover esta localidade?')) {
      const deleteOrg$ = this.adminService.locationDelete(locationId);
      await lastValueFrom(deleteOrg$);
      this.sharedInfo();
    }
  }
}
