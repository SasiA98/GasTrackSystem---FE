import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { Resource } from '@shared/models/resource.model';
import { PageResponse } from '@shared/models/page-response.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { AdvancedSearchBasePageComponent } from 'src/app/base/base-page/advanced-search-base-page.component';
import { AdvancedSearchCriteria } from 'src/app/base/models/advanced-search/advanced-search-criteria.model';
import { AdvancedSearchOperator } from 'src/app/base/models/advanced-search/advanced-search-operator.enum';
import { AdvancedSearchSimpleCriteria } from 'src/app/base/models/advanced-search/advanced-search-simple-criteria.model';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { EmptyObject } from 'src/app/base/types/empty-object.type';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { MatDialog } from '@angular/material/dialog';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { Skill } from '@shared/models/skill.model';
import { SkillsTableColumns } from '../../constants/skills-table-columns.constant';
import { SkillGroupCreationDialogComponent } from '../skill-group-creation-dialog/skill-group-creation-dialog.component';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { SkillsTableAction } from '../../constants/skills-table-actions.constant';
import { SkillsService } from '@shared/services/skills.service';
import { SkillGroupsService } from '@shared/services/skill-group.service';
import { SkillGroup } from '@shared/models/skill-group.model';
import { SkillCreationDialogComponent } from '../skill-creation-dialog/skill-creation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SkillGroupDeleteDialogComponent } from '../skill-group-delete-dialog/skill-group-delete-dialog.component';
import { SkillDeleteDialogComponent } from '../skill-delete-dialog/skill-delete-dialog.component';

export const DISABLED_FILTER = null;


@Component({
  selector: 'app-skills-search',
  templateUrl: './skills-search.component.html',
  styleUrls: ['./skills-search.component.scss']
})

export class SkillsSearchComponent extends AdvancedSearchBasePageComponent<PageResponse<Skill>> {
  content: string = RoutesEnum.SKILLS;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  Role = Role;
  columns: Column[] = SkillsTableColumns
  actions = SkillsTableAction;
  skills: Skill[] = []
  skillGroups: SkillGroup[] = [];
  form = new FormGroup({
    fullName: new FormControl('')
  });
  userRole: string[] = [];
  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly skillsService: SkillsService,
    private readonly skillGroupService: SkillGroupsService,
    private readonly translateService: TranslateService,
    private readonly toastrService: ToastrService,
    public readonly roleService: RolePermissionService,
    private readonly router: Router,
    private dialog: MatDialog
  ) {

    super(injector, ngxUiLoaderService);
    this.visibleColumns();
    this.getAllSkillGroups();
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('fullName')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
  }

  override resetSearch(): void {
    this.form.reset();
    super.resetSearch();
  }

  override ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.clearInterval();
  }

  startInterval() {
    this.clearInterval(); // Cancella il timer precedente se esiste
    this.searchTimer = setTimeout(() => {
      this.onSubmit();
    }, this.searchDelay);
  }

  clearInterval() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  }

  private visibleColumns(): void {
    this.userRole = this.roleService.getUserRole();
    if (this.userRole.includes(Role.ADMIN) || this.userRole.includes(Role.GDM) || this.userRole.includes(Role.DUM))
      this.columns = SkillsTableColumns;
  }


  openSkillGroupDialog(): void {

    const dialogRef = this.dialog.open(SkillGroupCreationDialogComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.onSubmit();
        this.showSuccessMessage();
      }
    });
  }

  deleteSkillGroupDialog(): void {
    const dialogRef = this.dialog.open(SkillGroupDeleteDialogComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
        this.showSuccessMessage();
    });
  }

  openSkillDialog(): void {
    const dialogRef = this.dialog.open(SkillCreationDialogComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.onSubmit();
        this.showSuccessMessage();
      }
    });

  }

  private getAllSkillGroups() : SkillGroup[] {
    this.skillGroupService.getAllSkillGroups().subscribe((skillGroup) => {
      this.skillGroups = skillGroup;
    });
    return this.skillGroups;
  }

  onActionClick(model: any, operation: number) {
    switch (operation) {
      case TableOperation.EDIT: this.onDetailClick(model); break;
      case TableOperation.DELETE: this.onDeleteClick(model); break;
    }
  }

  onDetailClick(skill: Skill) {

    const dialogRef = this.dialog.open(SkillCreationDialogComponent, {
      data: skill
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
      this.showSuccessMessage();
    });
  }

  onDeleteClick(skill: any) {

    const dialogRef = this.dialog.open(SkillDeleteDialogComponent, {
      data: skill
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
    });

  }


  protected search(
    criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria,
    sortCriteria?: PagingAndSortingCriteria
  ): Observable<PageResponse<Skill>> {
    return this.skillsService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {

    const fullName = this.form.get('fullName')?.value || "";

    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const fullNameOperand = this.getFullNameOperand(fullName);

    criteriaArray.push(fullNameOperand);


    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria = this.createAndComplexCriteria(criteriaArray);

    return result;
  }



  private getFullNameOperand(fullName: String): AdvancedSearchSimpleCriteria {
    return {
        field: 'name',
        value: fullName,
        operator: AdvancedSearchOperator.IS_LIKE
    }
  }

  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { name: 'asc' };
  }

  onNewClick(): void {
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(resource: Resource): void {
    this.router.navigate([resource.id], {
      relativeTo: this.activatedRoute
    });
  }

  onFilterClick(): void {
    this.router.navigate([RoutesEnum.FILTER], { relativeTo: this.activatedRoute });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
  }

  onSortChange(sort: { field: string; direction: 'asc' | 'desc' | '' }) {
    this.changeSort(sort.field, sort.direction || 'asc');
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }
}
