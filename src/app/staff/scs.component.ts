import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from '@environment/environment';
import { MENU_ITEMS } from '@shared/constants/menu-items.constants';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import { MenuItem } from '@shared/models/menu-item.model';
import { AuthFacadeService } from '@shared/services/auth/auth-facade.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { take } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { BreadcrumbService } from '@shared/services/breadcrumb.service';

@Component({
  selector: 'app-scs',
  templateUrl: './scs.component.html',
  styleUrls: ['./scs.component.scss']
})
export class ScsComponent implements OnInit {
  menuItems: MenuItem[] = MENU_ITEMS;
  expandedPanel = 0;
  currentUser: AuthenticatedUser | undefined;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly authFacadeService: AuthFacadeService,
    public readonly roleService: RolePermissionService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authFacadeService
      .getUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  onLogout(): void {
    this.authService.logout();
  }

  @Memoize()
  calculateExpandedPanel(): void {
    const currentUrl = this.router.url.slice(1);
    this.expandedPanel = this.menuItems
      .filter((item) => item.subMenu !== undefined)
      .findIndex((item: MenuItem) => {
        return item.subMenu?.some((subItem) => subItem.link === currentUrl);
      });
  }
}
