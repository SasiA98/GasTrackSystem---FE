import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewFormComponent } from './project-overview-form.component';

describe('ProjectOverviewFormComponent', () => {
  let component: ProjectOverviewFormComponent;
  let fixture: ComponentFixture<ProjectOverviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectOverviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOverviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
