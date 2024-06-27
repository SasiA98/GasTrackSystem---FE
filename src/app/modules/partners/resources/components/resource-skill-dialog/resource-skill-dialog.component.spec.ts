import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSkillDialogComponent } from './resource-skill-dialog.component';

describe('ResourceSkillDialogComponent', () => {
  let component: ResourceSkillDialogComponent;
  let fixture: ComponentFixture<ResourceSkillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceSkillDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSkillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
