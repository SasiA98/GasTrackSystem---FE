import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFormComponent } from './import-excel-form.component';

describe('ImportFormComponent', () => {
  let component: ImportFormComponent;
  let fixture: ComponentFixture<ImportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
