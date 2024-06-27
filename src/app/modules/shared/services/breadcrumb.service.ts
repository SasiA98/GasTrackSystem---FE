import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subject, filter } from 'rxjs';
import { RoutesEnum } from 'src/app/core/routes.enum';

export interface BreadcrumbData {
  title: string;
  breadcrumb: RoutesEnum[];
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private routeStack: RoutesEnum[] = [];
  private onBreadcrumbChange: Subject<RoutesEnum[]> = new Subject<RoutesEnum[]>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateRouteStack(this.activatedRoute.root);
    });
  }

  private updateRouteStack(route: ActivatedRoute): void {
    const routeStack: RoutesEnum[] = [];
    while (route.firstChild) {
      route = route.firstChild;
      const routeConfig = route.snapshot.routeConfig;
      if (routeConfig && routeConfig.data && (routeConfig.data as BreadcrumbData).breadcrumb) {
        const breadcrumbData = routeConfig.data as BreadcrumbData;
        routeStack.push(...breadcrumbData.breadcrumb);
      }
    }
    this.routeStack = routeStack;
    this.onBreadcrumbChange.next([...this.routeStack]);
  }

  getBreadcrumb(): RoutesEnum[] {
    return [...this.routeStack];
  }

  getOnBreadcrumbChange(): Subject<RoutesEnum[]> {
    return this.onBreadcrumbChange;
  }
}
