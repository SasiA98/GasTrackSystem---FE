import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, Output,
  ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Data } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { TableActionConstant } from './config/table-action.constant';
import { TableOperation } from './config/table-operation';
import { Column } from './models/column.model';
import * as moment from 'moment';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericTableComponent {
  private _columns: Column[] = [];
  private _showCheckbox = true;
  private _tableAction = TableActionConstant;
  selectedRows = new SelectionModel<any>(true, []);
  isAllSelected = false;
  visibleColumns: string[] = [];
  content: string = "";
  permission: string[] = [];
  inputValue: string = ''
  isFocused: boolean = false;
  isFocusedRow: any;
  isEnabled: boolean = true;
  currentDate: Date = new Date();

  isLeaveDateValid(leaveDate: string | Date): boolean {
    return new Date(leaveDate) >= this.currentDate;
  }


  constructor(private readonly activatedRoute: ActivatedRoute,
    private readonly roleService: RolePermissionService) {


    let data = (<BehaviorSubject<Data>>activatedRoute.data).getValue();
    this.content = data["content"];
    this.permission = data["permission"];
  }

  @Input() showSelectAll = false;
  @Input() pageSizeOptions: number[] = [];
  @Input() hidePageSize = true;
  @Input() sortDisabled = false;
  @Input() numberOfElements? = 10;
  @Input() totalElements: number | undefined;
  @Input() dataSource: any[] | undefined;
  @Input() currentPage = 0;
  @Input() totalPages?: number;

  @Input() set tableAction(action: { title: string; operation: TableOperation }[]) {
    this._tableAction = action;
    this.buildVisibleColumns();
  }
  get tableAction() {
    return this._tableAction;
  }

  @Input() set columns(columns: Column[]) {
    this._columns = columns;
    if (columns.length) {
      this.buildVisibleColumns();
    }
  }

  get columns() {
    return this._columns;
  }

  @Input() set showCheckbox(show: boolean) {
    if (this._showCheckbox && !show) {
      this.visibleColumns = this.visibleColumns.slice(1);
    }
    this._showCheckbox = show;
  }
  get showCheckbox() {
    return this._showCheckbox;
  }

  @Output() readonly onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() readonly onPageChange: EventEmitter<number> = new EventEmitter();
  @Output() readonly onPageSizeChange: EventEmitter<number> = new EventEmitter();
  @Output() saveDataEvent: EventEmitter<{ columnName: string, columnValue: string | number, model: any}> = new EventEmitter<{ columnName: string, columnValue: string | number, model: any}>();
  @Output() onFocusEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly onSortChange: EventEmitter<{
    field: string;
    direction: 'asc' | 'desc' | '';
  }> = new EventEmitter();
  @Output() readonly onActionClick: EventEmitter<{
    operation: TableOperation;
    model: any;
  }> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;

  private buildVisibleColumns() {
    this.visibleColumns = this.columns.map(({ attributeName }) => attributeName);
    if (this.showCheckbox) {
      this.visibleColumns = ['select'].concat(this.visibleColumns);
    }
    if (this.tableAction && this.tableAction.length && this.roleService.hasPermission(this.permission)) { //this.roleService.hasWritePermission(this.content)
      this.visibleColumns.push('action');
    }
  }

  pageChange(event: PageEvent) {
    if (event.pageIndex !== event.previousPageIndex) {
      this.onPageChange.emit(event.pageIndex);
    } else if (this.numberOfElements !== event.pageSize) {
      this.changePageSize(event.pageSize);
    }
  }

  transformValue(value: any, pipeArgs: any): any {
    let transformedValue = value;
    return transformedValue;
  }
  
  
  updateValue(newValue: any, attributeName: string, element: any): void {
    element[attributeName] = newValue;
  }  


  saveData(event: any, name: any, model: any) {
    const value = (event.target as HTMLInputElement).value;
    const data = { columnName: name, columnValue: value, model: model };
    this.saveDataEvent.emit(data);
}
  
  onFocus(row: any) {
    this.isFocusedRow = row; // Memorizza la riga che ha il focus
    this.onFocusEvent.emit(true);
  }
  

  changePageSize(pageSize: number) {
    this.numberOfElements = pageSize;
    this.onPageSizeChange.emit(pageSize);
  }

  rowSelected(rigaSelezionata: any) {
    this.selectedRows.toggle(rigaSelezionata);
    this.onRowSelect.emit(rigaSelezionata);
  }

  allSelected() {
    if (this.dataSource?.length) {
      if (this.selectedRows.selected.length === this.dataSource?.length) {
        this.selectedRows.clear();
      } else {
        this.selectedRows.select(...this.dataSource);
      }
    }
  }

  actionClick(row: any, operation: TableOperation) {
    this.onActionClick.emit({
      operation,
      model: row
    });
  }

  sortChange(sort: Sort): void {
    this.onSortChange.emit({
      field: sort.active,
      direction: sort.direction
    });
  }
}
