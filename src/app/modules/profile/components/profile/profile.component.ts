import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Gender } from '@shared/enums/gender.enum';
import { PageResponse } from '@shared/models/page-response.model';
import { User } from '@shared/models/user.model';
import { ProfileService } from '@shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, take } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { PasswordMatchValidator } from '../../validators/password-match.validator';
import { PasswordValidator } from '@shared/validators/passwordValidator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends FormBasePageComponent<User> implements OnInit {
  editEnabled = false;
  numberOfProducts: number | undefined = 0;

  constructor(
    injector: Injector,
    private readonly toastrService: ToastrService,
    private readonly profileService: ProfileService,
    private readonly translateService: TranslateService
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    this.getProfile();
    super.ngOnInit();
  }

  enableEditing(): void {
    this.editEnabled = true;
    if(this.model){
      this.form.patchValue(this.model);
    }
  }

  resetForm(): void {
    this.form.reset();
    this.editEnabled = false;
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(title, message);
  }

  protected submitComplete(response: any): void {
    this.model = response;
    this.resetForm();
    this.showSuccessMessage();
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      password: new FormControl(''),
      newPassword: new FormControl('', [PasswordValidator.strongPassword()]),
      confirmPassword: new FormControl('', [PasswordValidator.strongPassword()]),
    }, PasswordMatchValidator('password', 'newPassword', 'confirmPassword'));
  }

  protected convertDataToModel(form: FormGroup): User {
    const user = form.getRawValue();
    if(user.confirmPassword) {
      delete user.confirmPassword;
    } else {
      delete user.confirmPassword;
      delete user.newPassword;
      delete user.password;
    }
    return user;
  }

  protected update(id: string | number, model: User): Observable<User> {
    if (this.model) {
      model.resource = this.model.resource
      model.status = this.model.status;
    }
    return this.profileService.updateProfile(model);
  }

  protected save(model: User): Observable<User> {
    throw new Error('Method not implemented.');
  }

  getProfile(): void {
    this.profileService.get().pipe(take(1)).subscribe(user => {
      this.model = user;
      this.idModel = user.id;
    });
  }

  getPathKey(): string {
    return '';
  }

  getModelById(id: string | number): Observable<User> {
    return EMPTY;
  }

}
