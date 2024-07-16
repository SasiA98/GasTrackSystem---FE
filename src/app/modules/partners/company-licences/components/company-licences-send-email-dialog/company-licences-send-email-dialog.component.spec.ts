import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLicencesSendEmailDialogComponent } from './company-licences-send-email-dialog.component';

describe('CompanyLicencesSendEmailDialogComponent', () => {
  let component: CompanyLicencesSendEmailDialogComponent;
  let fixture: ComponentFixture<CompanyLicencesSendEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLicencesSendEmailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLicencesSendEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
