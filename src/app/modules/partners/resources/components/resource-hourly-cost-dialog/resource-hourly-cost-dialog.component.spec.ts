import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHourlyCostDialogComponent } from './resource-hourly-cost-dialog.component';

describe('ResourceHourlyCostDialogComponent', () => {
  let component: ResourceHourlyCostDialogComponent;
  let fixture: ComponentFixture<ResourceHourlyCostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceHourlyCostDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHourlyCostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
