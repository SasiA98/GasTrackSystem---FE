import { Component, Injector } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfirmComponent } from '@shared/components/dialog-confirm/dialog-confirm.component';
import { Role } from '@shared/enums/role.enum';
import { UnitType } from '@shared/enums/type.enum';
import { UtilService } from '@shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeUntil } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Resource } from '@shared/models/resource.model';
import { Status } from '@shared/enums/status.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { Licence } from '@shared/models/licence.model';
import { LicenceService } from '@shared/services/licence.service';

@Component({
  selector: 'app-licence-form',
  templateUrl: './licence-form.component.html',
  styleUrls: ['./licence-form.component.scss']
})
export class LicenceFormComponent extends FormBasePageComponent<Licence> {
  Role = Role;
  UnitType = UnitType;
  Status = Status;
  resources: Resource[] = [];
  licenceName: string | number = '';
  ROLE_VISIBILITY = ROLE_VISIBILITY;

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    public readonly roleService: RolePermissionService,
    private readonly licenceService: LicenceService,
    private readonly translateService: TranslateService,
    public readonly dialog: MatDialog
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.isInsert()) {
      this.setCompanyNameInTheHTMLTitle();
    }
  }

  private setCompanyNameInTheHTMLTitle(){
    if (this.idModel !== undefined) {
      this.licenceService.get(String(this.idModel)).subscribe(
        (licence: Licence) => { this.licenceName = licence.name; }
      );
    }
  }

  protected submitComplete(response: Licence): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      note: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    });
  }

  protected convertDataToModel(form: FormGroup): Licence {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: Licence): Observable<Licence> {
    return this.licenceService.save(model);
  }

  protected update(id: string | number, model: Licence): Observable<Licence> {
    return this.licenceService.update(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<Licence> {
    return this.licenceService.get(id);
  }

  onSettingClick(): void {
    if (this.form.dirty) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
        data: { text: 'Unsaved changes will be lost. Are you sure?' }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.goToSetting();
      });
    } else this.goToSetting();
  }

  onDetailClick(resource: Resource) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from_company: 'company',
        company_id : this.idModel
      }
    };
    this.router.navigate(['/management', 'resources', resource.id], navigationExtras);
  }

  goToSetting() {
    this.router.navigate(['./setting'], { relativeTo: this.activatedRoute.parent });
  }

  goBack(): void {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }

  onDeleteClick(): void {
    if (this.idModel) {
      this.licenceService
        .delete(this.idModel)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.showSuccessMessage();
          this.goBack();
        });
    }
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }

}

