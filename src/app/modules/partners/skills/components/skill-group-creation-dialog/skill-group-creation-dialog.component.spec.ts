import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupCreationDialogComponent } from './skill-group-creation-dialog.component';

describe('SkillGroupCreationDialogComponent', () => {
  let component: SkillGroupCreationDialogComponent;
  let fixture: ComponentFixture<SkillGroupCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillGroupCreationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
