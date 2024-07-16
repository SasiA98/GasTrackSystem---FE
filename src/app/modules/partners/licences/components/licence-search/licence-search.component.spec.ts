import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceSearchComponent } from './licence-search.component';

describe('LicenceSearchComponent', () => {
  let component: LicenceSearchComponent;
  let fixture: ComponentFixture<LicenceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
