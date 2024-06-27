import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDeleteDialogComponent } from './skill-delete-dialog.component';

describe('ProjectDeleteDialogComponent', () => {
  let component: SkillDeleteDialogComponent;
  let fixture: ComponentFixture<SkillDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
