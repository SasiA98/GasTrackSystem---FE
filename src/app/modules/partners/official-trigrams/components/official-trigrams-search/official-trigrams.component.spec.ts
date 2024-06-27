import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialTrigramsComponent } from './official-trigrams.component';

describe('ResourceSearchComponent', () => {
  let component: OfficialTrigramsComponent;
  let fixture: ComponentFixture<OfficialTrigramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficialTrigramsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialTrigramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
