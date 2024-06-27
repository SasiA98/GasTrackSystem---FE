import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFilterComponent } from './resource-filter.component';

describe('ResourceFilterComponent', () => {
  let component: ResourceFilterComponent;
  let fixture: ComponentFixture<ResourceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
