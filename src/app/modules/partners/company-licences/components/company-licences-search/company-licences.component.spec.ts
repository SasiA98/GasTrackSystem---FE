import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLicencesSearchComponent } from './company-licences.component';

describe('CompanyLicencesSearchComponent', () => {
  let component: CompanyLicencesSearchComponent;
  let fixture: ComponentFixture<CompanyLicencesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLicencesSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLicencesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
