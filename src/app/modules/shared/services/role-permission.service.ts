import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Role } from '@shared/enums/role.enum';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import jwt_decode from 'jwt-decode';
import { MenuItem } from '@shared/models/menu-item.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService extends HttpBaseService<any> {

  constructor(injector: Injector,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService) {
    super(injector, environment.endpoints.roles);
  }

  public hasPermission(roles: string[] | undefined): boolean {
    if (roles === undefined || roles.length === 0) {
      return true;
    } else {
      const userAuthorities = this.getUserRole();
      return roles.some(role => userAuthorities.includes(role));
    }
  }

  getUserRole(): string[] {
    const userStored = localStorage.getItem('user');
    const user: AuthenticatedUser | undefined = userStored ? jwt_decode(userStored) : undefined;
    if(!user) {
      return [];
    }
    return user.authorities;
  }

  public hasContentPermission(subMenu: MenuItem[]): boolean {
    let result = false;
    subMenu.forEach( item => {
      if(this.hasPermission(item.permission)) {
        result = true;
      }
    })
    return result;
  }

  private checkAdminRole(): boolean {
    const userStored = localStorage.getItem('user');
    const user: AuthenticatedUser | undefined = userStored ? jwt_decode(userStored) : undefined;
    return user != undefined && user.authorities.includes(Role.ADMIN);
  }

  private showWarningMessage(): void {
    const title = this.translateService.instant('SETTING.MESSAGES.WARNING.TITLE');
    const message = this.translateService.instant('SETTING.MESSAGES.WARNING.DESCRIPTION');
    this.toastrService.warning(title, message);
  }
}
