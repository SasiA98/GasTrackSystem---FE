import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertAllocationDialogComponent } from './convert-allocation-dialog.component';

describe('ConvertAllocationDialogComponent', () => {
  let component: ConvertAllocationDialogComponent;
  let fixture: ComponentFixture<ConvertAllocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertAllocationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertAllocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
