import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfirmComponent } from '@shared/components/dialog-confirm/dialog-confirm.component';
import { TimesheetService } from '@shared/services/timesheet.service';
import { UnitService } from '@shared/services/unit.service';
import { UtilService } from '@shared/services/util.service';
import { ResourceService } from '@shared/services/resource.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, takeUntil } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Resource } from '@shared/models/resource.model';
import { Status } from '@shared/enums/status.enum';
import { Timesheet } from '@shared/models/timesheet.model';
import { Unit } from '@shared/models/unit.model';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { TimesheetProject } from '@shared/models/timesheet-project.model';
import { UnitTimesheetTableColumns } from '../../constants/unit-timesheet-table-columns.constant';
import { ResourceTimesheetInfo } from '@shared/models/resource-timesheet-info.model';

@Component({
  selector: 'app-unit-timesheet-form',
  templateUrl: './unit-timesheet-form.component.html',
  styleUrls: ['./unit-timesheet-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitTimesheetFormComponent extends FormBasePageComponent<Timesheet> {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  units: Unit[] = [];
  columns = UnitTimesheetTableColumns;
  tabLabels: string[] = [];
  permissions: boolean = false;
  currentUnitIndex: number = 0;
  tabIndex: number = -1;
  currentMonthIndex: number = 0;
  resourceTimesheetInfo: ResourceTimesheetInfo[] = [];

  @ViewChild('mat-tab-label-0-5') defaultMatTab!: MatTab;
  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly timesheetService: TimesheetService,
    private readonly roleService: RolePermissionService,
    private readonly resourceService: ResourceService,
    private readonly unitService: UnitService,
    private readonly translateService: TranslateService,
    public readonly dialog: MatDialog
  ) {
    super(injector);
    this.permissions = this.roleService.hasPermission(ROLE_VISIBILITY.TIMESHEETS);
    if (this.permissions) {
     this.loadUnitTimesheets();
    }
    else {
      this.router.navigate(['/access-denied']);
    }
  }

  loadUnitTimesheets(): void {
    this.unitService.getAll()
    .pipe(map(units => units.filter(unit => unit.status === Status.ENABLED)))
    .subscribe(units => this.units = units);
    this.updateTabLabels();

    if(this.currentUnitIndex == 0) {

      const currentDate = new Date();
      const adjustedMonth =  this.getAdjustedMonth(this.tabIndex);
      const currentMonth = adjustedMonth.month;
      const currentYear = adjustedMonth.year;
      const firstDayOfMonth = ""+currentYear+"-"+(currentMonth).toString().padStart(2, '0')+"-01";

      this.unitService.getAllResources(firstDayOfMonth).subscribe((resourceTimesheetInfo) => {
          this.resourceTimesheetInfo = resourceTimesheetInfo;
      });

    }
  }

    onUnitChange(unitId: number): void {
      this.currentUnitIndex = unitId;
      this.getResourceTimesheetInfo(this.tabIndex);
    }

  protected submitComplete(response: Timesheet): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      resource: new FormGroup({
        id: new FormControl('')
      }),
      unit: new FormGroup({
        id: new FormControl(0)
      }),
    });
  }

  protected convertDataToModel(form: FormGroup): Timesheet {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: Timesheet): Observable<Timesheet> {
    return this.timesheetService.save(model);
  }

  protected update(id: string | number, model: Timesheet): Observable<Timesheet> {
    return this.timesheetService.update(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<Timesheet> {
    return this.timesheetService.get(id);
  }

  displayFn(resource: Resource): string {
    return resource.name && resource.surname? resource.name +'' + resource.surname : resource.name || resource.surname;
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

  onDetailClick(resourceTimesheetInfo: ResourceTimesheetInfo): void {
    const url = this.router.createUrlTree(['/timesheet', 'resource-timesheet'], {
      queryParams: {
        from_unit_timesheet: 'unit-timesheet',
        unit_timesheet_id : this.idModel,
        unit_id: resourceTimesheetInfo.unitId,
        resource_id: resourceTimesheetInfo.resourceId,
      },
    });
    window.open(url.toString(), '_blank');
  }

  goToSetting() {
    this.router.navigate(['./setting'], { relativeTo: this.activatedRoute.parent });
  }

  goBack(): void {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }

  onDeleteClick(): void {
    if (this.idModel) {
      this.timesheetService
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

  private updateTabLabels() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth =
      '' + currentYear + '-' + currentMonth.toString().padStart(2, '0') + '-01';
    const months: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    // Aggiungi il mese precedente all'inizio dell'array delle etichette
    const previousMonthIndex = (currentMonth - 1 + 12) % 12;
    const previousYear = currentMonth - 1 < 0 ? currentYear - 1 : currentYear;
    this.tabLabels.unshift(`${months[previousMonthIndex]} ${previousYear}`);

    // Aggiungi i tre mesi precedenti all'array delle etichette con l'anno, nell'ordine inverso
    for (let i = 2; i <= 4; i++) {
      const previousMonthIndex = (currentMonth - i + 12) % 12;
      const previousYear = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      this.tabLabels.unshift(`${months[previousMonthIndex]} ${previousYear}`);
    }

    // Aggiungi il mese corrente alla fine dell'array delle etichette
    this.tabLabels.push(`${months[currentMonth]} ${currentYear}`);

    // Aggiungi il mese successivo alla fine dell'array delle etichette
    const nextMonthIndex = (currentMonth + 1) % 12;
    const nextYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;
    this.tabLabels.push(`${months[nextMonthIndex]} ${nextYear}`);

    this.currentMonthIndex = this.tabLabels.length - 2; // Imposta l'indice del mese corrente
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index - 5;
    this.getResourceTimesheetInfo(this.tabIndex);
  }

  getResourceTimesheetInfo(tabIndex: number){
    const currentDate = new Date();
    const adjustedMonth =  this.getAdjustedMonth(this.tabIndex);
    const currentMonth = adjustedMonth.month;
    const currentYear = adjustedMonth.year;
    const firstDayOfMonth = ""+currentYear+"-"+(currentMonth).toString().padStart(2, '0')+"-01";

    if(this.currentUnitIndex == 0) {
      this.unitService.getAllResources(firstDayOfMonth).subscribe((resourceTimesheetInfo) => {
        this.resourceTimesheetInfo = resourceTimesheetInfo;
    });
    } else {
    this.unitService.getResourceTimesheetInfoByUnitIdAndDate(this.currentUnitIndex, firstDayOfMonth).subscribe((resourceTimesheetInfo) => {
      if (resourceTimesheetInfo == null){
        this.resourceTimesheetInfo = [];
      } else {
        this.resourceTimesheetInfo = resourceTimesheetInfo;
      }
    });

    }
  }

  getAdjustedMonth(tabIndex: number): { month: number; year: number } {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1; // Aggiungi 1 per avere mesi da 1 a 12
    let currentYear = currentDate.getFullYear();

    currentMonth += tabIndex + 1;


    while (currentMonth <= 0) {
      currentMonth += 12;
      currentYear--;
    }

    while (currentMonth > 12) {
      currentMonth -= 12;
      currentYear++;
    }

    return { month: currentMonth, year: currentYear };
}

}
