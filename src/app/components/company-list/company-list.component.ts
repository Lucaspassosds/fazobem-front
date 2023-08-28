import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Organization } from 'src/constants/interfaces';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  isReady = false;

  displayCompanies: any[] = [];

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.sharedInfo();
  }

  sharedInfo() {
    this.displayCompanies = [];
    const calls = [this.adminService.organizationsGet()];

    forkJoin(calls)
      .toPromise()
      .then((result: any[]) => {
        const companies = result[0] as Organization[];
        console.log(companies);

        this.displayCompanies = companies.map((company) => ({
          organizationId: company.id,
          name: company.name,
          admins: company.admins
        }));
        this.isReady = true;
      });
  }

  navigateToCompanyCreate() {
    this.router.navigate(['company-create']);
  }

  navigateBack() {
    this.router.navigate(['routes']);
  }

  async deleteOrganization({ rowIndex }: { rowIndex: number }) {
    const { organizationId } = this.displayCompanies[rowIndex];

    if(confirm('Tem certeza de que quer remover esta organização?')) {
      const deleteOrg$ = this.adminService.organizationDelete(organizationId);
      await lastValueFrom(deleteOrg$);
      this.sharedInfo();
    }
  }
}
