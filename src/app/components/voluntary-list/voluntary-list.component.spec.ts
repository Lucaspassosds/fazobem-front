import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntaryListComponent } from './voluntary-list.component';

describe('VoluntaryListComponent', () => {
  let component: VoluntaryListComponent;
  let fixture: ComponentFixture<VoluntaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoluntaryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoluntaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
