import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClientInsertComponent } from './dialog-client-insert.component';

describe('DialogClientInsertComponent', () => {
  let component: DialogClientInsertComponent;
  let fixture: ComponentFixture<DialogClientInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogClientInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogClientInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
