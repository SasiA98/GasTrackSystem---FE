import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Role } from '@shared/enums/role.enum';
import { UtilService } from '@shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, mergeMap, of, startWith, takeUntil } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Resource } from '@shared/models/resource.model';
import { ResourceService } from '@shared/services/resource.service';
import { Project } from '@shared/models/project.model';
import { Allocation } from '@shared/models/allocation.model';
import { ProjectService } from '@shared/services/project.service';
import { SaleAllocationTableColumns } from 'src/app/modules/partners/projects/constants/sale-allocation-table-columns.constant';
import { RealAllocationTableColumns } from 'src/app/modules/partners/projects/constants/real-allocation-table-columns.constant';
import { ProjectStatus } from "@shared/enums/project-status.enum";
import { ProjectType } from '@shared/enums/project-type.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { Industry } from '@shared/enums/industry.enum';
import { AllocationService } from '@shared/services/allocation.service';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { ProjectAllocationDialogComponent } from 'src/app/modules/partners/projects/components/project-allocation-dialog/project-allocation-dialog.component'
import { AllocationTableActions } from 'src/app/modules/partners/projects/constants/allocation-table-actions.constant'
import { ProjectDeleteDialogComponent } from '../project-delete-dialog/project-delete-dialog.component';
import { ConvertAllocationDialogComponent } from '../convert-allocation-dialog/convert-allocation-dialog.component';
import { Unit } from '@shared/models/unit.model';
import { UnitService } from '@shared/services/unit.service';
import { Status } from '@shared/enums/status.enum';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent extends FormBasePageComponent<Project> {
  Role = Role;
  Industry = Industry;
  allocationForm: FormGroup;
  actions = AllocationTableActions;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  selectedResourceRoles: string[] = [];
  from = '';
  from_id = '';
  isTheProjectInPreSale = true;
  units: Unit[] = []

  ProjectStatus = [
    ProjectStatus.PRE_SALE,
    ProjectStatus.TO_START,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.CLOSED,
    ProjectStatus.LOST,
    ProjectStatus.CANCELLED,
  ];
  ProjectType = [
    ProjectType.PRODUCTIVE,
    ProjectType.INTERNAL,
    ProjectType.PRESALES,
    ProjectType.EXTERNAL,
    ProjectType.TRAINING,
    ProjectType.INTERPROJECT
  ];

  RolesToShow: Role[] = [Role.CONSULTANT, Role.PM]
  StatusProject = ProjectStatus;
  permissionsCost: boolean = false;
  permissionsSave: boolean = false;
  resources_pm: Resource[] = [];
  resources_rc: Resource[] = [];
  resources_dtl: Resource[] = [];
  resources_dum: Resource[] = [];
  resources_presale: Resource[] = [];
  resources_rc_pm: Resource[] = [];

  resourcesDumOb?: Observable<Resource[]> = of([]);
  resourcesPseOb?: Observable<Resource[]> = of([]);
  resourcesAllocationOb?: Observable<Resource[]> = of([]);
  selectedDum: Resource = {} as Resource;

  sale_columns = SaleAllocationTableColumns;
  real_columns = RealAllocationTableColumns;
  allocations_real: Allocation[] = [];
  allocations_sale: Allocation[] = [];
  projectFullTitle = '';

  isRealCommitmentInsertEnabled = false;

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastrService: ToastrService,
    private readonly projectService: ProjectService,
    private readonly resourceService: ResourceService,
    private readonly allocationService: AllocationService,
    public readonly roleService: RolePermissionService,
    private readonly unitService: UnitService,
    private readonly translateService: TranslateService,
    public readonly dialog: MatDialog
  ) {
    super(injector);
    this.permissionsSave = this.roleService.hasPermission(ROLE_VISIBILITY.NEW_PROJECT);
    if(this.permissionsSave) {
      this.unitService.getAll()
        .pipe(map(units => units.filter(unit => unit.status === Status.ENABLED)))
        .subscribe(units => this.units = units);
    }
    this.permissionsCost = this.roleService.hasPermission(ROLE_VISIBILITY.PROJECT_ESTIMATED_COST);
    this.allocationForm = this.createFormAllocation();
  }

  override async ngOnInit(): Promise<void> {
    try {
      await this.getAllResources();
      super.ngOnInit();
      if (!this.isInsert() && this.idModel !== undefined) {
        this.setProject();
        this.setAllocations();
        this.setFromResource();
        this.onCommitmentButtonChanged();
        if (this.isTheProjectInPreSale === false) {
          this.form.get('startDate')?.valueChanges.subscribe((date) => {
            this.allocationForm.get('startDate')?.setValue(date);
          });
          this.form.get('preSaleScheduledEndDate')?.valueChanges.subscribe((date) => {
            this.allocationForm.get('endDate')?.setValue(date);
          });
        }
        else {
          this.form.get('komDate')?.valueChanges.subscribe((date) => {
            this.allocationForm.get('startDate')?.setValue(date);
          });
          this.form.get('estimatedEndDate')?.valueChanges.subscribe((date) => {
            this.allocationForm.get('endDate')?.setValue(date);
          });
        }
      }
    } catch (error) {
      console.error('Error during initialization', error);
    }
  }


  setDumAndPresale(project: Project) {
    this.form.get('dumId')?.patchValue(project.dumId);
    this.form.get('presaleId')?.patchValue(project.presaleId);
  }


  initializeResourcesDUMOb() : void {
    this.resourcesDumOb = this.form.get('dumId')?.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources_dum, value);
        }
        return this.resources_dum;
      }));
  }

  initializeResourcesPSEOb() : void {
    this.resourcesPseOb = this.form.get('presaleId')?.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources_presale, value);
        }
        return this.resources_presale;
      }));
  }

  initializeResourcesAllocationOb() : void {
    this.resourcesAllocationOb = this.allocationForm.get('resource')?.get('id')?.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources_rc_pm, value);
        }
        return this.resources_rc_pm;
      }));
  }


  filterOptionsByLabel(options: Resource[], label: string): Resource[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: Resource) => {
      const fullName = `${option.name.toLowerCase()} ${option.surname.toLowerCase()}`;
      return fullName.includes(value);
    });
  }

  protected onCommitmentButtonChanged() {
    const commitmentControl = this.allocationForm.get('realCommitment');
    if (commitmentControl) {
      commitmentControl.valueChanges.subscribe(value => {
        this.isRealCommitmentInsertEnabled = value;
      });
    }
  }

  protected submitComplete(response: Project): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
    if(this.model.status == ProjectStatus.IN_PROGRESS){
      this.isTheProjectInPreSale = false;
    }
  }

  private setProject() {
    this.projectService.get(String(this.idModel)).subscribe((project: Project) => {
      this.projectFullTitle = project.name;
      this.isTheProjectInPreSale = (project.status == ProjectStatus.PRE_SALE || project.status == ProjectStatus.TO_START);
      this.setDumAndPresale(project);
    });
  }

  private setAllocations() {
    this.projectService.getAllocationsById(String(this.idModel)).subscribe((allocations: Allocation[]) => {
      this.allocations_real = allocations.filter(a => a.realCommitment === true);
      this.allocations_sale = allocations.filter(a => a.realCommitment === false);
    });
  }

  private setFromResource() {
    this.route.queryParams.subscribe(params => {
      if (params['from_resource'] !== undefined) {
        this.from = params['from_resource'];
        this.from_id = params['resource_id'];
      }
    });
  }

  private getAllResources(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.resourceService
        .getAll()
        .pipe(
          mergeMap((resources) => {
            const resources_pm = resources.filter((r) =>
              r.roles.includes(Role.PM)
            );
            const resources_dum = resources.filter((r) =>
              r.roles.includes(Role.DUM)
            );
            const resources_presale = resources.filter(r => {
              for (let role of [Role.PSE, Role.PSM, Role.PSL]) {
                if (r.roles.includes(role)) {
                  return true;
                }
              }
              return false;
            });
            const resources_dtl = resources.filter((r) =>
              r.roles.includes(Role.DTL)
            );
            const resources_rc = resources.filter((r) =>
              r.roles.includes(Role.CONSULTANT)
            );
            return of({
              resources_pm,
              resources_dum,
              resources_rc,
              resources_presale,
              resources_dtl
            });
          })
        )
        .subscribe({
          next: (resources) => {
            const { resources_pm, resources_dum, resources_presale, resources_rc, resources_dtl } = resources;
            this.resources_pm = resources_pm;
            this.resources_rc = resources_rc;
            this.resources_dtl = resources_dtl;
            this.resources_dum = resources_dum;
            this.resources_presale = resources_presale;
            this.resources_rc_pm = resources_rc.concat(resources_pm).concat(resources_dtl).filter((r, index, self) =>
              index === self.findIndex((t) => (
                t.id === r.id
              ))
            );
            this.initializeResourcesDUMOb();
            this.initializeResourcesPSEOb();
            this.initializeResourcesAllocationOb();
            resolve(); // Indica che l'operazione è terminata
          },
          error: (err) => {
            reject(err); // Gestisci l'errore
          }
        });
    });
  }


  protected createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      industry: new FormControl(''),
      presaleId: new FormControl('', [Validators.required]),
      unitId: new FormControl('', [Validators.required]),
      dumId: new FormControl('', [Validators.required]),
      bmTrigram: new FormControl('', [Validators.required]),
      status: new FormControl(ProjectStatus.PRE_SALE, [Validators.required]),
      projectType: new FormControl('', [Validators.required]),
      crmCode: new FormControl('', [Validators.maxLength(255)]),
      projectId: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      ic: new FormControl(false),
      startDate: new FormControl(''),
      preSaleScheduledEndDate: new FormControl(''),
      estimatedEndDate: new FormControl(''),
      hrCost: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      preSaleFixedCost: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      currentFixedCost: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      currentEstimatedCost: new FormControl(''),
      preSaleEstimatedCost: new FormControl(''),
      currentEstimatedHrCost: new FormControl(''),
      preSaleEstimatedHrCost: new FormControl(''),
      estimatedCost: new FormControl(''),
      actualCost: new FormControl(''),
      komDate: new FormControl(''),
      endDate: new FormControl(''),
      note: new FormControl('', [Validators.maxLength(255)])
    });
  }

  private createFormAllocation(): FormGroup {
    return new FormGroup({
      resource: new FormGroup({
        id: new FormControl('')
      }),
      role: new FormControl(''),
      commitment: new FormControl(''),
      startDate: new FormControl(),
      endDate: new FormControl(''),
      realCommitment: new FormControl(false)
    });
  }

  onResourceChange(event: any, resourceId: number): void {
    if (event.isUserInput) {
      const selectedResource = this.resources_rc_pm.find(resource => resource.id === resourceId);
      if (selectedResource) {
        this.selectedResourceRoles = selectedResource.roles.filter(role => role === 'PM' || role === 'CONSULTANT' || role === 'DTL');
      } else {
        this.selectedResourceRoles = [];
      }
      this.allocationForm.get('role')?.reset();
    }
  }

  checkPreSaleProjectStatus(): boolean{
    if(this.form.get('status')?.value != 'Pre-Sale' && this.form.get('status')?.value != 'To Start' && this.form.get('status')?.value != 'Cancelled' && this.form.get('status')?.value != 'Lost'){
      return true;
    }
    else{
      return false;
    }
  }

  onSubmitAllocation(): void {
    if (this.allocationForm.valid && this.model) {

      const data = this.allocationForm.value
      const project = UtilService.removeNull({ id: this.model.id });

      const allocation: Allocation = {
        resourceId: data.resource.id,
        projectId: project.id,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate,
        hours: data.hours,
        commitmentPercentage: data.commitmentPercentage,
        realCommitment: data.realCommitment,
        commitment: data.commitment
      }

      var isRealCommitment = this.allocationForm.get('realCommitment')?.value;

      if (isRealCommitment) {
        allocation.commitmentPercentage = allocation.commitment;
        allocation.hours = null;
        allocation.commitment = null;
      } else {
        allocation.hours = allocation.commitment;
        allocation.commitmentPercentage = null;
        allocation.commitment = null;
      }


      this.allocationService.save(allocation).subscribe((allocation) => {
        if (allocation.realCommitment === true) {
          this.allocations_real = [...this.allocations_real, allocation];
          this.showSuccessRealCommitment();
        } else {
          this.allocations_sale = [...this.allocations_sale, allocation];
          this.showSuccessSaleCommitment();
        }

        this.reset();
        this.allocationForm.get('realCommitment')?.setValue(isRealCommitment);
        setTimeout(() => {
          this.resetProjectEndDates();
        }, 1000);
        this.setAllocations();
      });
    }
  }


   reset() {
    this.allocationForm.reset();

    Object.keys(this.allocationForm.controls).forEach(key => {
      this.allocationForm.get(key)?.setErrors(null);
    });

    const resourceControl = this.allocationForm.get('resource')?.get('id');
    if (resourceControl) {
      resourceControl.setErrors(null);
    }

    this.allocationForm.get('commitment')?.setErrors(null);

  }

  protected convertDataToModel(form: FormGroup): Project {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: Project): Observable<Project> {
    return this.projectService.save(model);
  }

  protected update(id: string | number, model: Project): Observable<Project> {
    return this.projectService.update(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<Project> {
    return this.projectService.get(id);
  }

  goBack(): void {
    if (this.from == '')
      this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    else if (this.from == 'resource')
      this.router.navigate(['/management', 'resources', this.from_id]);
  }


  onDeleteClick(): void {
    if (this.idModel) {
      this.projectService
        .delete(this.idModel)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.showSuccessMessage();
          this.goBack();
        });
    }
  }

  onActionClick(model: any, operation: number) {
    switch (operation) {
      case TableOperation.DETAIL: this.onDetailClick(model.resourceId); break;
      case TableOperation.EDIT: this.onEditClick(model); break;
      case TableOperation.DELETE: this.onDeleteAllocationClick(model); break;
      case TableOperation.CONVERT: this.onConvertClick(model); break;
    }
  }


  onDetailClick(resourceId: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from_project: 'project',
        project_id: this.idModel
      }
    };
    this.router.navigate(['/management', 'resources', resourceId], navigationExtras);
  }


  onEditClick(allocation: Allocation) {

    const dialogRef = this.dialog.open(ProjectAllocationDialogComponent, {
      data: allocation
    });

    dialogRef.afterClosed().subscribe(result => {
      this.setAllocations();
      setTimeout(() => {
        this.resetProjectEndDates();
      }, 1000);
    });
  }

  onConvertClick(allocation: Allocation) {

    const dialogRef = this.dialog.open(ConvertAllocationDialogComponent, {
      data: allocation
    });

    dialogRef.afterClosed().subscribe(result => {
      this.setAllocations();

      setTimeout(() => {
        this.resetProjectEndDates();
      }, 1100);
    });
  }


  onDeleteAllocationClick(allocation: Allocation) {

    const dialogRef = this.dialog.open(ProjectDeleteDialogComponent, {
      data: allocation
    });

    dialogRef.afterClosed().subscribe(result => {
      this.setAllocations();

      setTimeout(() => {
        this.resetProjectEndDates();
      }, 1100);
    });

  }

  protected resetProjectEndDates(){
     this.projectService.get(String(this.idModel)).subscribe((project: Project) => {
      if (project) {
        this.form.get('preSaleScheduledEndDate')?.patchValue(project.preSaleScheduledEndDate);
        this.form.get('estimatedEndDate')?.patchValue(project.estimatedEndDate);
        this.form.get('currentEstimatedCost')?.patchValue(project.currentEstimatedCost);
        this.form.get('preSaleEstimatedCost')?.patchValue(project.preSaleEstimatedCost);
        this.form.get('currentEstimatedHrCost')?.patchValue(project.currentEstimatedHrCost);
        this.form.get('preSaleEstimatedHrCost')?.patchValue(project.preSaleEstimatedHrCost);
        this.form.get('preSaleFixedCost')?.patchValue(project.preSaleFixedCost);
        this.form.get('currentFixedCost')?.patchValue(project.currentFixedCost);
      } else {
        console.error('Project data is null or undefined');
      }
    }, error => {
      console.error('Error fetching project data:', error);
    });
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }

  showSuccessRealCommitment(): void {
    const title = this.translateService.instant('MESSAGES.REAL_COMMITMENT.TITLE');
    const message = this.translateService.instant('MESSAGES.REAL_COMMITMENT.DESCRIPTION');
    this.toastrService.success(message, title);
  }

  showSuccessSaleCommitment(): void {
    const title = this.translateService.instant('MESSAGES.SALE_COMMITMENT.TITLE');
    const message = this.translateService.instant('MESSAGES.SALE_COMMITMENT.DESCRIPTION');
    this.toastrService.success(message, title);
  }

  replaceUnderscores(value: string): string {
    return value.replace(/_/g, ' ');
  }

  displayLabelFnDum(id: number) {
    const r = this.resources_dum.find(resource => resource.id === id);
    return r ? `${r.name} ${r.surname}` : '';
  }

  displayLabelFnPse(id: number) {
    const r = this.resources_presale.find(resource => resource.id === id);
    return r ? `${r.name} ${r.surname}` : '';
  }

  displayLabelFnAllocation(id: number) {
    const r = this.resources_rc_pm.find(resource => resource.id === id);
    return r ? `${r.name} ${r.surname}` : '';
  }

}
