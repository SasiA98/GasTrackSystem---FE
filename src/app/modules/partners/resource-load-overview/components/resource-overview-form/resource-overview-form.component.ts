import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { Status } from '@shared/enums/status.enum';
import { ResourceLoadModel } from '@shared/models/resource-load.model';
import { Resource } from '@shared/models/resource.model';
import { Unit } from '@shared/models/unit.model';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { UnitService } from '@shared/services/unit.service';
import { Observable, map } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { AllocationStatus } from '@shared/enums/pre-allocation.enum';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';


interface Month {
  name: string;
  weeks: number[];
  isCurrentMonth?: boolean;
  index: number;
}

const COLUMN_WIDTH = 243;

@Component({
  selector: 'app-resource-overview-form',
  templateUrl: './resource-overview-form.component.html',
  styleUrls: ['./resource-overview-form.component.scss'],
})

export class ResourceOverviewFormComponent extends FormBasePageComponent<Unit> {

  @ViewChild('tableResourses', {static: false}) tableResourses!: ElementRef;
  
  displayedColumns: string[] = ['unitTrigram', 'name', 'cw'];
  firstHeaderRow: string[] = ['header-empty-group-first'];
  costKeys: any[] = [];

  permissions: boolean = false;
  units: Unit[] = [];
  resourcesType: Resource[] = [];
  currentUnitIndex: number = 0;
  currentYear: number = 0;
  isLoading: boolean = true;
  months: Month[] = [];
  resourcesLoad: ResourceLoadModel[] = [];
  currentMonth: number = (new Date()).getMonth() + 1;

  monthsList: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  AllocationStatus = [
    AllocationStatus.PREALLOCATED,
    AllocationStatus.NOT_PREALLOCATED
  ]
  StatusAllocation = AllocationStatus;
  selectedValue: boolean = false;
  pageable: PagingAndSortingCriteria = { page: 0, size: 20 };

  // Pagination properties
  pageSize!: number;
  currentPage!: number;
  totalElements!: number;

  protected override submitComplete(response: any): void {
    throw new Error('Method not implemented.');
  }
  protected override convertDataToModel(form: FormGroup): Unit {
    throw new Error('Method not implemented.');
  }
  protected override save(model: Unit): Observable<Unit> {
    throw new Error('Method not implemented.');
  }
  protected override update(id: string | number, model: Unit): Observable<Unit> {
    throw new Error('Method not implemented.');
  }
  override getPathKey(): string {
    return 'id';
  }
  override getModelById(id: string | number): Observable<Unit> {
    throw new Error('Method not implemented.');
  }

  constructor(injector: Injector,
    private readonly roleService: RolePermissionService,
    private readonly unitService: UnitService,
    private readonly router: Router
  ) {
    super(injector);
   
  }

  override ngOnInit(): void {
    this.checkPermissions();
  }
 
  loadResourceGantt(): void {
    this.extractMonths();
    this.getAllResources(this.currentUnitIndex, this.selectedValue, this.pageable);
  
  }

  checkPermissions(): void {
    this.permissions = this.roleService.hasPermission(ROLE_VISIBILITY.NEW_RESOURCE);
    if (this.permissions) {
      this.loadResourceGantt();
    } else {
      this.router.navigate(['/access-denied']);
    }
  }

  getMonthName(monthNumber: number): string {
    return this.monthsList[monthNumber - 1];
  }

  getMonthIndex(monthName: string): number {
    return this.monthsList.indexOf(monthName) + 1;
  }

  extractMonths(): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();

    this.unitService.getResourceLoad(this.currentUnitIndex, this.currentYear, this.selectedValue).subscribe(res => {
      const monthsMap = new Map<number, Set<number>>();
      this.totalElements = res.totalElements

      let maxMonthsResource = res.content[0];
      let maxMonthsCount = 0;

      res.content.forEach(resourceLoad => {
        const monthsCount = Object.keys(resourceLoad.weeklyRealCommitmentPct).length;
        if(monthsCount > maxMonthsCount) {
          maxMonthsCount = monthsCount;
          maxMonthsResource = resourceLoad;
        }
      });

      Object.keys(maxMonthsResource.weeklyRealCommitmentPct).forEach(month => {
        const monthNumber = parseInt(month);
        const weekNumbers = Object.keys(maxMonthsResource.weeklyRealCommitmentPct[monthNumber])
        .map(week => parseInt(week))
        .sort((a, b) => a -b);

        if(weekNumbers.length > 0) {
          if(!monthsMap.has(monthNumber)) {
            monthsMap.set(monthNumber, new Set<number>());
          }
          weekNumbers.forEach(week => monthsMap.get(monthNumber)!.add(week));
        }
      });

      res.content.forEach(resourceLoad => {
        Object.keys(resourceLoad.weeklyRealCommitmentPct).forEach(month => {
          const monthNumber = parseInt(month);
          const weekNumbers = Object.keys(resourceLoad.weeklyRealCommitmentPct[monthNumber] || {})
          .map(week => parseInt(week))
          .sort((a, b) => a - b);

          if(weekNumbers.length > 0) {
            if(!monthsMap.has(monthNumber)) {
              monthsMap.set(monthNumber, new Set<number>());
            }
            weekNumbers.forEach(week => monthsMap.get(monthNumber)!.add(week));
          }
        });
      });

      this.months = [];
      Array.from(monthsMap.keys()).sort((a, b) => a - b).forEach(monthNumber => {
        const monthName = this.getMonthName(monthNumber);
        let weeks = Array.from(monthsMap.get(monthNumber)!).sort((a, b) => a -b);

        if(monthNumber === 12 && weeks.length === 52 && weeks[0] === 1 && weeks[weeks.length - 1] === 52) {
          weeks = [...weeks.slice(1), weeks[0]];
        }

        if(monthNumber === 12) {
          const indexOfOne = weeks.indexOf(1);
          const indexOfFiftyTwo = weeks.indexOf(52);
          if(indexOfOne !== -1 && indexOfFiftyTwo !== -1) {
            weeks = weeks.filter(week => week !== 1);
            weeks.splice(indexOfFiftyTwo + 1, 0, 1);
          }
        }

        this.months.push({
          name: monthName,
          weeks,
          isCurrentMonth: monthNumber === this.currentMonth,
          index: this.getMonthIndex(monthName)});
        this.firstHeaderRow.push(monthName + '-header');
        this.displayedColumns.push(monthName);
      });
    });

  }

  onSelectionChange(event: any): void {
    const selectedValue = event.value as AllocationStatus;
    
    if (selectedValue === AllocationStatus.PREALLOCATED) {
      this.selectedValue = true;
    } else {
      this.selectedValue = false;
    }
    
    this.getAllResources(this.currentUnitIndex, this.selectedValue, this.pageable);
  }
  
  isOddRow(index: number): boolean {
    return (index % 4 === 0 || index % 4 === 1);
  }

  isOddRowReverse(index: number): boolean {
    return ((index + 2) % 4 === 0 || (index + 2) % 4 === 1);
    }
  
  getObjectKeys(obj: any, i: number): string[] {
    return Object.keys(obj[i]);
  }

  parseMonth(month: string): number {
    return parseInt(month, 10);
  }



  // Funzione per restituire la classe CSS corrispondente in base alla percentuale
  getPercentageColorClass(percent: number): string {
    if (percent >= 100) {
      return 'bg-success';
    } else if (percent >= 70) {
      return 'bg-warning';
    } else if (percent >= 30) {
      return 'bg-orange'; // Personalizza il colore arancione
    } else {
      return 'bg-danger';
    }
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      resource: new FormGroup({
        id: new FormControl('')
      }),
      unit: new FormGroup({
        id: new FormControl(0)
      }),
      status: new FormControl(AllocationStatus.NOT_PREALLOCATED)
    });
  }

  onUnitChange(unitId: number): void {
    this.currentUnitIndex = unitId;
    this.getAllResources(this.currentUnitIndex, this.selectedValue, this.pageable);
  }

  private getAllResources(id: string | number, preAllocation: boolean,  pageable: PagingAndSortingCriteria): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();

    this.unitService.getResourceLoad(id, this.currentYear, preAllocation, pageable).subscribe((resourcesLoadModel) => {
      this.resourcesLoad = [];
      this.totalElements = resourcesLoadModel.totalElements;
      
      resourcesLoadModel.content.forEach(resourceLoad => {

        if ((Object.keys(resourceLoad.weeklyRealCommitmentPct[12]).length !== 0)) {
          const weeklyRealCommitment = resourceLoad.weeklyRealCommitmentPct[12];
          const invertedRealCommitmentPct: { [week: number]: number } = {};

          const firstWeekValue = weeklyRealCommitment[1]; 

          // Rimuoviamo il valore della prima settimana
          delete weeklyRealCommitment[1];

          // Copiamo il resto degli elementi nell'oggetto invertito
          Object.entries(weeklyRealCommitment).forEach(([week, value]) => {
            let newWeek = parseInt(week) - 1;
            if (newWeek === 0) {
              newWeek = 52;
            }
            invertedRealCommitmentPct[newWeek] = value;
          });

          // Aggiungiamo il valore della prima settimana in coda
          invertedRealCommitmentPct[52] = firstWeekValue;

          resourceLoad.weeklyRealCommitmentPct[12] = invertedRealCommitmentPct;

          const weeklySaleCommitmentPct= resourceLoad.weeklySaleCommitmentPct[12];
          const invertedSaleCommitment: { [week: number]: number } = {};

          const firstWeekValueEstimated = weeklySaleCommitmentPct[1]; // Salviamo il valore della prima settimana

          // Rimuoviamo il valore della prima settimana
          delete weeklySaleCommitmentPct[1];

          // Copiamo il resto degli elementi nell'oggetto invertito
          Object.entries(weeklySaleCommitmentPct).forEach(([week, value]) => {
            let newWeek = parseInt(week) - 1;
            if (newWeek === 0) {
              newWeek = 52;
            }
            invertedSaleCommitment[newWeek] = value;
          });

          // Aggiungiamo il valore della prima settimana in coda
          invertedSaleCommitment[52] = firstWeekValueEstimated;

          resourceLoad.weeklySaleCommitmentPct[12] = invertedSaleCommitment;
        }
       
      });

      resourcesLoadModel.content.forEach(resourceLoad => {
        this.resourcesLoad.push({
          ...resourceLoad,
          cw: 'Sales'
        });
        this.resourcesLoad.push({
          ...resourceLoad,
          cw: 'Real'
        });
      });
      this.isLoading = false;
      setTimeout( () => {
        let currentMonth = this.months.find(m => m.isCurrentMonth);
        if(!currentMonth) return;
        let currentMonthIndex = this.months.indexOf(currentMonth);
        this.tableResourses.nativeElement.scrollLeft = COLUMN_WIDTH * currentMonthIndex;
      }, 200);
    });

  }

  updatePagination(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.resourcesLoad.slice(start, end);
  }
  

  onPageChange(pageEvent: PageEvent): void {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageable = {
      page: this.currentPage,
      size: this.pageSize
    };
    this.getAllResources(this.currentUnitIndex, this.selectedValue, this.pageable);
  }
}
