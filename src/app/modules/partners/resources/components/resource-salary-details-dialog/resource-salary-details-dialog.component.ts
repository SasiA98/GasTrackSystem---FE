import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResourceSalaryDetails } from '@shared/models/resource-salary-details.model';


@Component({
  selector: 'app-resource-hourly-cost-dialog',
  templateUrl: './resource-salary-details-dialog.component.html',
  styleUrls: ['./resource-salary-details-dialog.component.scss']
})
export class ResourceSalaryDetailsDialogComponent implements OnInit {

  displayedColumns: string[] = ['ralStartDate', 'ral',  'dailyAllowanceStartDate', 'dailyAllowance', 'ccnlLevelStartDate', 'ccnlLevel'];
  dataSource = new MatTableDataSource<ResourceSalaryDetails>();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private ref: MatDialogRef<ResourceSalaryDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { salaryDetails: ResourceSalaryDetails[] }
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.salaryDetails) {
      this.dataSource.data = this.data.salaryDetails;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.disabled = true;
  }

  closeDialog(): void {
    this.ref.close();
  }

  apply(): void {
    this.ref.close();
  }
}
