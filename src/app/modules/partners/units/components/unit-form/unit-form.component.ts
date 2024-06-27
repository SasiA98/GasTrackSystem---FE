import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfirmComponent } from '@shared/components/dialog-confirm/dialog-confirm.component';
import { Role } from '@shared/enums/role.enum';
import { Unit } from '@shared/models/unit.model';
import { UnitType } from '@shared/enums/type.enum';
import { UnitService } from '@shared/services/unit.service';
import { UtilService } from '@shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeUntil } from 'rxjs';
import { ResourceTableColumns } from '../../../resources/constants/resource-table-columns.constant';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Resource } from '@shared/models/resource.model';
import { Status } from '@shared/enums/status.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss']
})
export class UnitFormComponent extends FormBasePageComponent<Unit> {
  Role = Role;
  UnitType = UnitType;
  Status = Status;
  columns = ResourceTableColumns.filter(c => c.attributeName !== 'unit');
  resources: Resource[] = [];
  unitName: string | number = '';
  ROLE_VISIBILITY = ROLE_VISIBILITY;

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    public readonly roleService: RolePermissionService,
    private readonly unitService: UnitService,
    private readonly translateService: TranslateService,
    public readonly dialog: MatDialog
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.isInsert()) {
      this.getAllResources(this.idModel);
      this.setUnitNameInTheHTMLTitle();
    }
  }

  private getAllResources(id : string | number) : void {
    this.unitService.getActiveResources(id).subscribe((resources) => {
      this.resources = resources;
    });
  }

  private setUnitNameInTheHTMLTitle(){
    if (this.idModel !== undefined) {
      this.unitService.get(String(this.idModel)).subscribe(
        (unit: Unit) => { this.unitName = unit.trigram; }
      );
    }
  }

  protected submitComplete(response: Unit): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      trigram: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      type: new FormControl(''),
      status: new FormControl(Status.ENABLED)
    });
  }

  protected convertDataToModel(form: FormGroup): Unit {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: Unit): Observable<Unit> {
    return this.unitService.save(model);
  }

  protected update(id: string | number, model: Unit): Observable<Unit> {
    return this.unitService.update(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<Unit> {
    return this.unitService.get(id);
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
        from_unit: 'unit',
        unit_id : this.idModel
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
      this.unitService
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
