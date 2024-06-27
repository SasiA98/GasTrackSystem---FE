import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAllocationDialogComponent } from './project-allocation-dialog.component';

describe('ProjectAllocationDialogComponent', () => {
  let component: ProjectAllocationDialogComponent;
  let fixture: ComponentFixture<ProjectAllocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAllocationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAllocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
