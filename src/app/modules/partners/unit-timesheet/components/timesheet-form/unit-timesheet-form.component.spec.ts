import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTimesheetFormComponent } from './unit-timesheet-form.component';

describe('UnitFormComponent', () => {
  let component: UnitTimesheetFormComponent;
  let fixture: ComponentFixture<UnitTimesheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitTimesheetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTimesheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
