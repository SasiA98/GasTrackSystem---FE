import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TimesheetService } from '@shared/services/timesheet.service';
import { UnitService } from '@shared/services/unit.service';
import { UtilService } from '@shared/services/util.service';
import { ResourceService } from '@shared/services/resource.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, of, startWith, subscribeOn, takeUntil } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Resource } from '@shared/models/resource.model';
import { Status } from '@shared/enums/status.enum';
import { Timesheet } from '@shared/models/timesheet.model';
import { Unit } from '@shared/models/unit.model';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { TimesheetDialogComponent } from '../timesheet-dialog/timesheet-dialog.component';
import { TimesheetTableColumns } from '../../constants/timesheet-table-columns.constant';
import { TimesheetProject } from '@shared/models/timesheet-project.model';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { ResourceTimesheetTableActions } from '../../constants/resource-timesheet-table-actions.constant';
import { Project } from '@shared/models/project.model';
import { TimesheetProjectService } from '@shared/services/timesheet-project.service';
import { Allocation } from '@shared/models/allocation.model';
import { TimesheetDeleteDialogComponent } from '../timesheet-delete-dialog/timesheet-delete-dialog.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Role } from '@shared/enums/role.enum';


@Component({
  selector: 'app-timesheet-form',
  templateUrl: './timesheet-form.component.html',
  styleUrls: ['./timesheet-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimesheetFormComponent extends FormBasePageComponent<Timesheet> {

  actions = ResourceTimesheetTableActions;
  filteredResources: Resource[] = [];
  filteredResourcesObservable?: Observable<Resource[]> = of([]);
  units: Unit[] = [];
  columns = TimesheetTableColumns;
  tabLabels: string[] = [];
  permissions: boolean = false;
  addProjectCheck: boolean = false;
  currentResourceIndex: number = 0;
  currentMonthIndex: number = 0;
  tabIndex: number = -1;
  all_timesheets: TimesheetProject[] = [];
  timesheet_id: string | number | undefined;
  remainingWorkHours: any = null;
  totalWorkHours: any = null;
  monthLabel: any;
  resources: Resource[] = [];
  selectedResource : Resource = {} as Resource

  @ViewChild('mat-tab-label-0-5') defaultMatTab!: MatTab;
  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastrService: ToastrService,
    private readonly timesheetService: TimesheetService,
    private readonly timesheetProjectService: TimesheetProjectService,
    private readonly roleService: RolePermissionService,
    private readonly resourceService: ResourceService,
    private readonly unitService: UnitService,
    private readonly translateService: TranslateService,
    public readonly dialog: MatDialog,
  ) {
    super(injector);
    this.permissions = this.roleService.hasPermission(ROLE_VISIBILITY.TIMESHEETS);
    if (this.permissions) {
      this.unitService
        .getAll()
        .pipe(map((units) => units.filter((unit) => unit.status === Status.ENABLED)))
        .subscribe((units) => {
          this.units = units;
          this.setUnitFromUnitTimesheet();
        });
    }
    else {
      this.router.navigate(['/access-denied']);
    }

  }


  private async setUnitFromUnitTimesheet() {
    this.route.queryParams.subscribe((params) => {
      if (params['unit_id'] !== undefined) {
        const unitId = params['unit_id'];
        const selectedUnit = this.units.find((unit) => unit.id == unitId);
        if (selectedUnit && selectedUnit.id) {
          this.form.get('unit')?.get('id')?.setValue(selectedUnit.id);
          this.filterResourcesByUnit(selectedUnit.id).then(() => {
            this.setResourceFromUnitTimesheet();
          });
        }
      }
    });
  }

  

  override ngOnInit(): void {
    super.ngOnInit();
    this.updateTabLabels();
  }

  autocompleteResources(): void {
    this.filteredResourcesObservable = this.form.get('resource')?.get('id')?.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources, value);
        }
        return this.resources;
      }));
  }

  filterOptionsByLabel(options: Resource[], label: string): Resource[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: Resource) => {
      const fullName = `${option.name.toLowerCase()} ${option.surname.toLowerCase()}`;
      return fullName.includes(value);
    });
  }


  displayFnAutocompleteResources(id: number) {
    const r = this.resources.find(resource => resource.id === id);
    return r ? `${r.name} ${r.surname}` : '';
  }

  openTimesheetDialog(): void {
    const dialogRef = this.dialog.open(TimesheetDialogComponent, {
      data: {
        timesheet_id: this.timesheet_id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTimesheet(this.tabIndex);
    });
  }

  async filterResourcesByUnit(unitId: string | number): Promise<void> {
    if(unitId != null){
      this.form.get('resource')?.get('id')?.setValue('');
    }
    return new Promise<void>((resolve, reject) => {
      if (unitId != null) {
        this.unitService.getActiveResourcesInLastSixMonths(unitId).subscribe(
          (resources) => {
            this.resources = resources.filter((resource) => !resource.roles.includes(Role.ADMIN));
            this.autocompleteResources();
            resolve();
          },
          (error) => {
            console.error('Errore durante il recupero delle risorse:', error);
            reject(error);
          }
        );
      } else {
        reject("L'ID dell'unità non è valido");
      }
    });
  }

  private setResourceFromUnitTimesheet() {
    this.route.queryParams.subscribe((params) => {
      if (params['resource_id'] !== undefined) {
        const resourceId = params['resource_id'];
        const selectedResource = this.resources.find(
          (resource) => resource.id == resourceId
        );
        if (selectedResource && selectedResource.id) {
          this.form.get('resource')?.get('id')?.setValue(selectedResource.id);
          this.handleResourceChange(selectedResource.id);
        }
      }
    });
  }
  
  onResourceChange(event: MatOptionSelectionChange, resourceId: number): void {
    if (event.isUserInput) {
      this.handleResourceChange(resourceId);
    }
  }
  
  private handleResourceChange(resourceId: number): void {
    console.log(resourceId);
      this.currentResourceIndex = resourceId;
      this.getTimesheet(this.tabIndex);
      this.addProjectCheck = true;
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
        id: new FormControl('')
      }),
      startDate: new FormControl(''),
      remainingWorkHours: new FormControl(''),
      totWorkHours: new FormControl(0),
      relatedProjects: new FormGroup({
        id: new FormControl(''),
        estimatedCost: new FormControl(''),
        actualCost: new FormControl(''),
        name: new FormControl(''),
        projectId: new FormControl(''),
        workHours: new FormControl(''),
        cost: new FormControl(''),
        note: new FormControl(''),
      })
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
    return resource.name && resource.surname
      ? resource.name + '' + resource.surname
      : resource.name || resource.surname;
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
    this.getTimesheet(this.tabIndex);
  }


  setDisabledColumn(): any {
    return null;
  }

  handleSaveData(event: { columnName: string, columnValue: string | number }, model: any) {
    const columnName = event.columnName.replace("TIMESHEET.FIELDS.", "").toLowerCase();
    let hours = model.hours;
    let note = model.note;
    let preImportHours = model.hours;
    if (columnName === 'hours' && model.hours != 0) {
      hours = +event.columnValue;
      } else if (columnName === 'note' && model.note != '') {
      note = event.columnValue.toString();
    }
    if (this.timesheet_id != undefined && this.timesheet_id != -1) {
      const timesheet_submit = { id: this.timesheet_id } as Timesheet;
      const project_submit = { id: model.projectId } as Project;
      const allocation_submit = { id: model.allocationId } as Allocation;
      const timesheetProject = this.setTimesheetProject(project_submit, timesheet_submit, hours, preImportHours, allocation_submit, note);
      if(timesheetProject != undefined){
        this.timesheetProjectService
          .update(model.id, timesheetProject)
          .subscribe(
            () => {
              this.getTimesheet(this.tabIndex);
            },
            (error) => {
              this.getTimesheet(this.tabIndex);
              console.log(error);
            }
          )

        }
      }
    }

    setTimesheetProject(project: Project, timesheet: Timesheet, hours: number, preImportHours: number, allocation?: Allocation, note?: string): TimesheetProject | undefined {

      if (project.id !== undefined && timesheet.id !== undefined) {
        let timesheetProject: TimesheetProject;

        if (!allocation || allocation.id === undefined) {
          timesheetProject = {
            timesheetId: timesheet.id,
            projectId: project.id,
            hours: hours,
            preImportHours : preImportHours,
            note: note
          };
        } else {
          timesheetProject = {
            timesheetId: timesheet.id,
            projectId: project.id,
            allocationId: allocation.id,
            hours: hours,
            preImportHours : preImportHours,
            note: note
          };
        }

        return timesheetProject;
      } else {
        return undefined;
      }
    }


  handleFocus(isFocused: boolean) {
  }

  getTimesheet(tabIndex: number) {
    const adjustedMonth = this.getAdjustedMonth(tabIndex);
    const currentMonth = adjustedMonth.month;
    const currentYear = adjustedMonth.year;
    const firstDayOfMonth = "" + currentYear + "-" + (currentMonth).toString().padStart(2, '0') + "-01";
    this.resourceService.getTimesheetByDateAndId(this.currentResourceIndex, firstDayOfMonth).subscribe((timesheet) => {
      if (timesheet == null) {
        this.all_timesheets = [];
        this.timesheet_id = -1;
        this.remainingWorkHours = null;
        this.totalWorkHours = null;
        this.monthLabel = null;
      } else {
        this.timesheet_id = timesheet.id;
        this.all_timesheets = timesheet.relatedProjects;
        this.remainingWorkHours = timesheet.remainingWorkHours;
        this.totalWorkHours = timesheet.totWorkHours;
        this.monthLabel = timesheet.startDate;
        this.form.get('totWorkHours')?.setValue(this.totalWorkHours);
        this.form.get('startDate')?.setValue(timesheet.startDate);
      }
    });
  }

  getAdjustedMonth(tabIndex: number): { month: number; year: number } {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
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

  onActionClick(model: any, operation: number) {
    switch (operation) {
      case TableOperation.DETAIL: this.onDetailClickTimesheetProject(model); break;
      case TableOperation.DELETE: this.onDeleteTimesheetProjectClick(model); break;
    }
  }

  onDetailClickTimesheetProject(timesheetProject: TimesheetProject) {
    window.open(`/management/projects/${timesheetProject.projectId}`, '_blank');
  };

  onDeleteTimesheetProjectClick(timesheetProject: TimesheetProject) {

    const dialogRef = this.dialog.open(TimesheetDeleteDialogComponent, {
      data: timesheetProject
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTimesheet(this.tabIndex);
    });

  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }

  checkRemainingWorkHours(): void {
    if (this.remainingWorkHours < 0) {
      this.showErrorMessage("Remaining work hours cannot be negative!");
    }
  }

  showErrorMessage(message: string): void {
    const title = this.translateService.instant('Error');
    this.toastrService.error(message, title);
  }
}
