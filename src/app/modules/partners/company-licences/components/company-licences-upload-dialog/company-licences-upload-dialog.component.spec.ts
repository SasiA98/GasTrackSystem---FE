import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLicencesUploadDialogComponent } from './company-licences-upload-dialog.component';

describe('CompanyLicencesUploadDialogComponent', () => {
  let component: CompanyLicencesUploadDialogComponent;
  let fixture: ComponentFixture<CompanyLicencesUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLicencesUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLicencesUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
