import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceFormComponent } from './licence-form.component';

describe('LicenceFormComponent', () => {
  let component: LicenceFormComponent;
  let fixture: ComponentFixture<LicenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
