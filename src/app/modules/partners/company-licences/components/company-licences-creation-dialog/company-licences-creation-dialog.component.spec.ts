import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLicencesCreationDialogComponent } from './company-licences-creation-dialog.component';

describe('CompanyLicencesCreationDialogComponent', () => {
  let component: CompanyLicencesCreationDialogComponent;
  let fixture: ComponentFixture<CompanyLicencesCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLicencesCreationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLicencesCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
