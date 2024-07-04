import { Component, Injector } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Resource } from '@shared/models/resource.model';
import { Allocation } from '@shared/models/allocation.model';
import { ResourceStatus } from '@shared/enums/resource-status.enum';
import { ResourceService } from '@shared/services/resource.service';
import { UtilService } from '@shared/services/util.service';
import { UnitService } from '@shared/services/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith, takeUntil, tap } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Unit } from '@shared/models/unit.model';
import { ResourceHourlyCostDialogComponent } from 'src/app/modules/partners/resources/components/resource-hourly-cost-dialog/resource-hourly-cost-dialog.component'
import { ResourceHourlyCost } from '@shared/models/resource-hourly-cost.model';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { Role } from '@shared/enums/role.enum';
import { Status } from '@shared/enums/status.enum';
import { AllocationRealTableColumns } from '../../constants/allocation-real-table-columns.constant';
import { Project } from '@shared/models/project.model';
import { ResourceSalaryDetails } from '@shared/models/resource-salary-details.model';
import { ResourceSalaryDetailsDialogComponent } from '../resource-salary-details-dialog/resource-salary-details-dialog.component';
import { AllocationSaleTableColumns } from '../../constants/allocation-sale-table-columns.constant';
import { CcnlLevel } from '@shared/enums/ccnl-level.enum';
import { ResourceSkillDialogComponent } from '../resource-skill-dialog/resource-skill-dialog.component';
import { Skill } from '@shared/models/skill.model';
import { minimumAgeValidator } from '@shared/validators/minimumAgeValidator';
import { emailTEOValidator } from '@shared/validators/emailTEOValidator';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Regex per validare l'email
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: { value: control.value } };
  };
}


export class ResourceFormComponent extends FormBasePageComponent<Resource> {

  ResourceStatus = ResourceStatus;
  // ccnlLevels = Object.values(CcnlLevel);
  // ccnlControl = this.form.get('ccnlLevel') as FormControl;
  // filteredCcnlLevels!: Observable<CcnlLevel[]>;
  Role = Role;
  units: Unit[] = [];
  resourceFullName = '';
  hourlyCosts? : ResourceHourlyCost[] = [];
  permissions: boolean = false;
  permissionEmails: boolean = false;
  permissionsHourlyCosts: boolean = false;
  permissionsAllocations: boolean = false;
  permHiringDet: boolean = false;
  permissionsSkills: boolean = false;
  skills?: Skill[] = [];
  allocations?: Allocation [];
  columnsReal = AllocationRealTableColumns;
  columnsSale = AllocationSaleTableColumns;
  projects_real?: Allocation [];
  projects_sale?: Allocation[] = [];
  hasDisabledRoles = false;
  from = '';
  from_id = '';
  // permissionRAL: boolean = false;
  // salaryDetails? : ResourceSalaryDetails[] = [];

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastrService: ToastrService,
    private readonly resourceService: ResourceService,
    private readonly roleService: RolePermissionService,
    private readonly unitService: UnitService,
    private readonly translateService: TranslateService,
    private dialog: MatDialog
  ) {
    super(injector);
    this.permissions = this.roleService.hasPermission(ROLE_VISIBILITY.NEW_RESOURCE);
    this.permissionEmails = this.roleService.hasPermission(ROLE_VISIBILITY.RESOURCE_EMAIL);
    this.permissionsHourlyCosts = this.roleService.hasPermission(ROLE_VISIBILITY.RESOURCE_HOURLY_COSTS);
    this.permissionsAllocations = this.roleService.hasPermission(ROLE_VISIBILITY.ALLOCATIONS);
    // this.permissionRAL = this.roleService.hasPermission(ROLE_VISIBILITY.RESOURCE_SALARY_DETAILS);
    this.permHiringDet = this.roleService.hasPermission(ROLE_VISIBILITY.RESOURCE_HOURLY_COSTS);
    this.permissionsSkills = this.roleService.hasPermission(ROLE_VISIBILITY.SKILLS);
    if (this.permissions) {
      this.unitService.getAll()
        .pipe(map(units => units.filter(unit => unit.status === Status.ENABLED)))
        .subscribe(units => this.units = units);
    }
   
  //   this.filteredCcnlLevels = this.ccnlControl.valueChanges
  // .pipe(
  //   startWith(''),
  //   map(value => this._filter(value))
  // );
  }


  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.isInsert()) {
      this.setStatus();
      this.setResourceFullNameInTheHTMLTitle();
      this.setHourlyCosts();
      this.setSkills();
      this.setAllocationsResource();
      this.setFromUser();
      this.setFromUnit();
      // this.setSalaryDetails();
      this.setFromProject();
    }
  }

  // private _filter(value: string): CcnlLevel[] {
  //   const filterValue = value.toLowerCase().trim();
  //   if (!filterValue) {
  //     return this.ccnlLevels;
  //   }
  //   return this.ccnlLevels.filter(option => option.toLowerCase().includes(filterValue));
  // }


  private setFromUser() {
    this.route.queryParams.subscribe(params => {
      if (params['from_user'] !== undefined) {
        this.from = params['from_user'];
        this.from_id = params['user_id'];
      }
    });
  }

  private setFromUnit() {
    this.route.queryParams.subscribe(params => {
      if (params['from_unit'] !== undefined) {
        this.from = params['from_unit'];
        this.from_id = params['unit_id'];
      }
    });
  }

  private setFromProject() {
    this.route.queryParams.subscribe(params => {
      if (params['from_project'] !== undefined) {
        this.from = params['from_project'];
        this.from_id = params['project_id'];
      }
    });
  }


  private setAllocationsResource(){
    if (this.permissionsAllocations) {
      this.resourceService.getAllocationsById(String(this.idModel)).subscribe((allocations: Allocation []) => {
        this.allocations = allocations;
        this.projects_real = allocations.filter(a => a.realCommitment === true);
        this.projects_sale = allocations.filter(a => a.realCommitment === false);
        });
    }
  }

  protected submitComplete(response: Resource): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      employeeId: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]),
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(255), emailvalidator(), Validators.minLength(18)]),
      birthDate: new FormControl('', [Validators.required, minimumAgeValidator(18)]),
      lastWorkingTime: new FormControl(40, [Validators.required, Validators.pattern('^[0-9]+$')]),
      lastWorkingTimeStartDate: new FormControl('',[Validators.required]),
      hiringDate: new FormControl('', [Validators.required]),
      unit: new FormGroup({
        id: new FormControl('', [Validators.required])
      }),
      status: new FormControl(''),
      site: new FormControl(''),
      lastHourlyCost: new FormControl(''),
      lastHourlyCostStartDate: new FormControl(),
      roles: new FormControl('', [Validators.required]),
      // ccnlLevel: new FormControl(''),
      // ccnlLevelStartDate: new FormControl(''),
      // dailyAllowance: new FormControl(''),
      // dailyAllowanceStartDate: new FormControl(''),
      // ral: new FormControl(''),
      // ralStartDate: new FormControl(''),
      trigram: new FormControl('', [Validators.maxLength(3)]),
      leaveDate: new FormControl(''),
      location: new FormControl(''),
      note: new FormControl('', [Validators.maxLength(255)])
    });
  }

  private setStatus() {
    if (this.idModel !== undefined) {
      this.resourceService.get(String(this.idModel)).subscribe((resource: Resource) => {
        const currentDate = new Date();
        const hiringDate = new Date(resource.hiringDate);

        let status;

        if (hiringDate > currentDate) {
          status = ResourceStatus.HIRING;
        } else {
          if (resource.leaveDate === undefined) {
            status = ResourceStatus.HIRED;
          } else {
            const leaveDate = new Date(resource.leaveDate);

            if (leaveDate >= currentDate) {
              status = ResourceStatus.OUTGOING;
            } else {
              status = ResourceStatus.RESIGNED;
            }
          }
        }
        this.form.patchValue({ status: status });
      });
    }
  }

  isRoleDisabled(role: Role): boolean {
    /*
       If the resource has a project that is not yet finished and
       has the role of PM, DTL, or Consultant in the project, they cannot leave that role.
    */

    var disabled = false;
    if (this.allocations !== undefined) {
      for (let i = 0; i < this.allocations.length; i++) {
        const allocation = this.allocations[i];
        const allocationRole = allocation.role;

        if(role === allocationRole){

          if(allocation.endDate !== undefined){
            const allocationEndDate = new Date(allocation.endDate);
            const currentDate = new Date();

            if (allocationEndDate > currentDate){
              disabled = true;
              this.hasDisabledRoles = true;
            }
          }
        }
      }
    }

    return disabled;
  }

  onRoleFieldClicked(): void {
    if (this.hasDisabledRoles === true){
      this.showRoleMessage();
    }
  }

  private showRoleMessage(): void {
    const title = this.translateService.instant('RESOURCES.MESSAGES.ROLE_INFO.TITLE');
    const message = this.translateService.instant('RESOURCES.MESSAGES.ROLE_INFO.DESCRIPTION');
    this.toastrService.info(message, title);
  }


  hourlyCostHistoryDialog(){
    const dialogRef = this.dialog.open(ResourceHourlyCostDialogComponent, {
      minWidth: '30%',
      maxWidth: '90%',
      data: {
        hourlyCosts: this.hourlyCosts
      }
    });
  }

  // salaryDetailsDialog(){
  //   const dialogRef = this.dialog.open(ResourceSalaryDetailsDialogComponent, {
  //     minWidth: '50%',
  //     maxWidth: '90%',
  //     data: {
  //       salaryDetails: this.salaryDetails
  //     }
  //   });
  // }

  skillsHistoryDialog(){
    const dialogRef = this.dialog.open(ResourceSkillDialogComponent, {
      minWidth: '30%',
      maxWidth: '100%',
      data: {
        skill: this.skills,
        resourceId: this.idModel,
        resourceName: this.resourceFullName  
      }
    });
  }

  private setSkills(){
    if (this.idModel !== undefined && this.permissionsHourlyCosts) {
      this.skills = [];
    }
  }

  private setResourceFullNameInTheHTMLTitle(){
    if (this.idModel !== undefined) {
      this.resourceService.get(String(this.idModel)).subscribe((resource: Resource) => {
        this.resourceFullName = resource.name + ' ' + resource.surname;
      });

      if (this.permissionsHourlyCosts) {
        this.resourceService.getAllHourlyCostsById(this.idModel).subscribe((hourlyCosts: ResourceHourlyCost[]) => {
          this.hourlyCosts = hourlyCosts;
        });
      }
      // if (this.permissionRAL) {
      //   this.resourceService.getSalaryDetailsById(this.idModel).subscribe((salaryDetails: ResourceSalaryDetails[]) => {
      //     this.salaryDetails = salaryDetails;
      //   });
      // }
    }
  }

  private setHourlyCosts(){
    if (this.idModel !== undefined && this.permissionsHourlyCosts) {
      this.resourceService.getAllHourlyCostsById(this.idModel).subscribe((hourlyCosts: ResourceHourlyCost[]) => {
        this.hourlyCosts = hourlyCosts;
      });
    }
  }

  private showInfoMessage(): void {
    const title = this.translateService.instant('RESOURCES.MESSAGES.LEAVE_DATE_INFO.TITLE');
    const message = this.translateService.instant('RESOURCES.MESSAGES.LEAVE_DATE_INFO.DESCRIPTION');
    this.toastrService.info(message, title);
  }

  // private setSalaryDetails(){
  //   if (this.idModel !== undefined && this.permissionRAL) {
  //     this.resourceService.getSalaryDetailsById(this.idModel).subscribe((salaryDetails: ResourceSalaryDetails[]) => {
  //       this.salaryDetails = salaryDetails;
  //     });
  //   }
  // }
  protected convertDataToModel(form: FormGroup): Resource {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: Resource): Observable<Resource> {
    return this.resourceService.save(model);
  }

  protected update(id: string | number, model: Resource): Observable<Resource> {
    if (model.leaveDate !== null){
      this.showInfoMessage()
    }
    return this.resourceService.update(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<Resource> {
    return this.resourceService.get(id);
  }

  goBack(): void {
    if (this.from == '')
      this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    else if (this.from == 'user')
      this.router.navigate(['/management', 'users']);
    else if (this.from == 'unit')
      this.router.navigate(['/management', 'units', this.from_id]);
    else if (this.from == 'project')
      this.router.navigate(['/management', 'projects', this.from_id]);
  }


  onDetailClick(projectId: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from_resource: 'resource',
        resource_id : this.idModel
      }
    };
    this.router.navigate(['/management', 'projects', projectId], navigationExtras);
  }


  onDeleteClick(): void {
    if (this.idModel) {
      this.resourceService
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

  replaceUnderscores(value: string): string {
      return value.replace(/_/g, ' ');
    }
}
