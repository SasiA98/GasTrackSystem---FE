import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Country } from '@shared/enums/country.enum';
import { Gender } from '@shared/enums/gender.enum';
import { Role } from '@shared/enums/role.enum';
import { Unit } from '@shared/models/unit.model';
import { User } from '@shared/models/user.model';
import { UtilService } from '@shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, of, startWith } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { UserService } from '../../services/user.service';
import { Status } from '@shared/enums/status.enum';
import { ResourceService } from '@shared/services/resource.service';
import { Resource } from '@shared/models/resource.model';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { BreadcrumbService } from '@shared/services/breadcrumb.service';
import { RoutesEnum } from 'src/app/core/routes.enum';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends FormBasePageComponent<User> {
  Role = Role;
  roles = Role;
  Gender = Gender;
  Country = Country;
  units: Unit[] = [];
  Status = Status;
  resources : Resource[] = [];
  resourcesOb? : Observable<Resource[]> = of([]);
  userName = '';
  selectedResource?: Resource;
  toastrVisible: boolean = false;


  constructor(
    injector: Injector,
    private breadcrumbService: BreadcrumbService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (!this.isInsert()) {
      this.getAllUsers()
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      if (this.idModel !== undefined) {
        this.setNameInTheHTMLTitle();
        this.selectedResource = this.model?.resource;
      }
    } else {
      this.getAllResources();
    }
  }

  private getAllResources() {
    this.resourceService.getAll().subscribe((resources) => {
      this.resources = resources.filter(resource => resource.roles.length > 1 || !resource.roles.includes(Role.CONSULTANT));
      this.userService.getAll().subscribe((users) => {
        this.resources = this.resources.filter(newResource => {
          return !users.some(user => user.resource && user.resource.id === newResource.id);
        });
        this.initializeResourcesAllocationOb();
      });
    });
  }

  private getAllUsers() {
    this.resourceService.getAll().subscribe((resources) => {
      this.resources = resources.filter(resource => resource.roles.length > 1 || !resource.roles.includes(Role.CONSULTANT));
    });
  }

  onResourceChange(resourceId: number) {
    this.selectedResource = this.resources.find(r => r.id === resourceId);
    const title = this.translateService.instant('MESSAGES.WARNING_USER.TITLE');
    const message = this.translateService.instant('MESSAGES.WARNING_USER.DESCRIPTION');

    this.toastrVisible = true;
    this.toastrService.warning(message, title).onHidden.subscribe(() => {
      this.toastrVisible = false;
    });
  }

  isButtonDisabled(): boolean {
      if (this.selectedResource && this.toastrVisible == false) {
        return false;
      }
      else {
        return true;
      }
  }

  private setNameInTheHTMLTitle() {
    this.userService.get(this.idModel).subscribe((response) => {
      this.userName = response.resource.name + ' ' + response.resource.surname;
    });
  }


  getFullName(resource: any): string {
    if (!resource) {
      if (this.model?.resource)
        return this.model?.resource?.name + ' ' + this.model?.resource?.surname;
      else
        return '';
    }
    return resource?.name + ' ' + resource?.surname;
  }

  protected submitComplete(response: User): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      resource: new FormGroup({
        id: new FormControl('')
      }),
      status: new FormControl('Enabled')
    });
  }

  protected convertDataToModel(form: FormGroup): User {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: User): Observable<User> {
    return this.userService.save(model);
  }

  protected update(id: string | number, model: User): Observable<User> {
    return this.userService.patch(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<User> {
    return this.userService.get(id);
  }

  goBack(): void {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }

  onDisableClick(): void {
    if (this.idModel !== undefined && this.model !== undefined) {
    const user: User = this.model;
    if (this.model.status === 'Disabled')
      this.model.status = 'Enabled';
    else if (this.model.status === 'Enabled')
      this.model.status = 'Disabled';
    this.update(this.idModel, user)
      .subscribe(() => {
        this.showSuccessMessage();
        this.goBack();
      });
    }
  }

  onActionClick(model: any, operation: number) {
    switch (operation) {
      case TableOperation.DETAIL: this.onDetailResourceClick(model); break;
    }
  }

  onDetailResourceClick(user: User): void {
    if (this.idModel !== undefined && this.model !== undefined) {
    const link = ['/management', 'resources', this.model.resource.id];
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from_user: 'user',
        user_id : user.id
      }
    };
    this.router.navigate(link, navigationExtras);
    }
  }

  resetPassword(): void {
    if (this.idModel !== undefined && this.model !== undefined)
      this.userService.resetPassword(this.idModel).subscribe(() => {
        this.showSuccessMessageFix("Success", "Password reset successfully");
      });
  }

  showSuccessMessageFix(title: string, message: string): void {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);
    this.toastrService.success(message, title);
  }

  showSuccessMessage(): void {
     this.showSuccessMessageFix("Success", "The temporary password has been sent by e-mail to the new user");
  }

  displayLabelFn(id: number) {
    const r = this.resources.find(resource => resource.id === id);
    return r ? `${r.name} ${r.surname}` : '';
  }

  initializeResourcesAllocationOb() : void {
    this.resourcesOb = this.form.get('resource')?.get('id')?.valueChanges.pipe(
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
}
