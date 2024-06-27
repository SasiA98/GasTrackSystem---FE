import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportResourcesFormComponent } from './import-resources-form.component';

describe('ImportResourcesFormComponent', () => {
  let component: ImportResourcesFormComponent;
  let fixture: ComponentFixture<ImportResourcesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportResourcesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportResourcesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
