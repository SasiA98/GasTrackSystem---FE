import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResourceHourlyCost } from '@shared/models/resource-hourly-cost.model';


@Component({
  selector: 'app-resource-hourly-cost-dialog',
  templateUrl: './resource-hourly-cost-dialog.component.html',
  styleUrls: ['./resource-hourly-cost-dialog.component.scss']
})
export class ResourceHourlyCostDialogComponent implements OnInit {

  displayedColumns: string[] = ['startDate', 'cost'];
  dataSource = new MatTableDataSource<ResourceHourlyCost>();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private ref: MatDialogRef<ResourceHourlyCostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hourlyCosts: ResourceHourlyCost[] }
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.hourlyCosts) {
      this.dataSource.data = this.data.hourlyCosts;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sortData();
    this.sort.disabled = true;
  }

  sortData(): void {
    this.dataSource.sort?.sort({
      id: 'startDate',
      start: 'desc',
      disableClear: true
    });
  }

  closeDialog(): void {
    this.ref.close();
  }

  apply(): void {
    this.ref.close();
  }
}
