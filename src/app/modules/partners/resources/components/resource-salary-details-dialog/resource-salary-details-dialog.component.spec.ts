import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSalaryDetailsDialogComponent } from './resource-salary-details-dialog.component';

describe('ResourceSalaryDetailsDialogComponent', () => {
  let component: ResourceSalaryDetailsDialogComponent;
  let fixture: ComponentFixture<ResourceSalaryDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceSalaryDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSalaryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
