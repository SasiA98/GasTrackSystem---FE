import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthSubformComponent } from './auth-subform.component';

describe('AuthSubformComponent', () => {
  let component: AuthSubformComponent;
  let fixture: ComponentFixture<AuthSubformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthSubformComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
