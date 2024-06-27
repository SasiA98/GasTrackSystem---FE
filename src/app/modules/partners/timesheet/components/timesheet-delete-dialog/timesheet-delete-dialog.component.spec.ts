import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDeleteDialogComponent } from './timesheet-delete-dialog.component';

describe('ProjectDeleteDialogComponent', () => {
  let component: TimesheetDeleteDialogComponent;
  let fixture: ComponentFixture<TimesheetDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
