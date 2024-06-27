import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceOverviewFormComponent } from './resource-overview-form.component';

describe('ResourceOverviewFormComponent', () => {
  let component: ResourceOverviewFormComponent;
  let fixture: ComponentFixture<ResourceOverviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceOverviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceOverviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
