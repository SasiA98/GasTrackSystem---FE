import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb: string[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.setBreadcrumb();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setBreadcrumb();
      }
    });
  }

  setBreadcrumb() {
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    this.breadcrumb = urlSegments.map((segment, index) => {
      // Remove everything after the '?' in the segment
      const cleanSegment = segment.split('?')[0];
      return urlSegments.slice(0, index + 1).map(seg => seg.split('?')[0]).join('/');
    });
  }
}
