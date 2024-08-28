import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLicencesDeleteDialogComponent } from './company-licences-delete-dialog.component';

describe('CompanyLicencesSendEmailDialogComponent', () => {
  let component: CompanyLicencesDeleteDialogComponent;
  let fixture: ComponentFixture<CompanyLicencesDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLicencesDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLicencesDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
