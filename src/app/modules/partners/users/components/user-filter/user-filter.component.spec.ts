import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFilterDialogComponent } from './resource-filter-dialog.component';

describe('ResourceFilterDialogComponent', () => {
  let component: ResourceFilterDialogComponent;
  let fixture: ComponentFixture<ResourceFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
