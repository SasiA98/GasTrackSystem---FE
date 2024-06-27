import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScsComponent } from './scs.component';

describe('ScsComponent', () => {
  let component: ScsComponent;
  let fixture: ComponentFixture<ScsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
