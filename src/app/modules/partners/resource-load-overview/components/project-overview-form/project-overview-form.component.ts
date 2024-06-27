import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { ProjectStatus } from '@shared/enums/project-status.enum';
import { Status } from '@shared/enums/status.enum';
import { ApiResponse, ProjectLoadModel } from '@shared/models/projects-load.model';
import { Resource } from '@shared/models/resource.model';
import { Unit } from '@shared/models/unit.model';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { UnitService } from '@shared/services/unit.service';
import { Observable, map } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';

interface Month {
  name: string;
  weeks: number[];
  isCurrentMonth?: boolean;
  index: number;
}

const COLUMN_WIDTH = 243;

@Component({
  selector: 'app-project-overview-form',
  templateUrl: './project-overview-form.component.html',
  styleUrls: ['./project-overview-form.component.scss']
})
export class ProjectOverviewFormComponent extends FormBasePageComponent<Unit> {

  @ViewChild('tableResourses', {static: false}) tableResourses!: ElementRef;
  displayedColumns: string[] = ['unitTrigram', 'status', 'name', 'cw'];
  firstHeaderRow: string[] = ['header-empty-group-first'];

  isLoading: boolean = true;
  permissions: boolean = false;
  units: Unit[] = [];
  resourcesType: Resource[] = [];
  currentUnitIndex!: number;
  currentYear: number = 0;
  months: Month[] = [];
  projectsLoad: ProjectLoadModel[] = [];
  currentMonth: number = (new Date()).getMonth() + 1;
  projectStatus: string[] = [''];
  pageable: PagingAndSortingCriteria = { page: 0, size: 20 };
  disableSelect = new FormControl(false);
  allOptionDisabled: boolean = false;
  allOptionSelected: boolean = true; // Inizialmente "All" è selezionato

  pageSize!: number;
  currentPage!: number;
  totalElements!: number;

  monthsList: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  ProjectStatus = [
    ProjectStatus.PRE_SALE,
    ProjectStatus.TO_START,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.CLOSED,
    ProjectStatus.LOST,
    ProjectStatus.CANCELLED,
  ];

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
    private router: Router,
    private readonly roleService: RolePermissionService,
    private readonly unitService: UnitService,) {
    super(injector);
  }

  override ngOnInit(): void {
    this.checkPermissions();
  }

  checkPermissions(): void {
    this.permissions = this.roleService.hasPermission(ROLE_VISIBILITY.GANTT);
    if (this.permissions) {
      this.loadUnits();
    } else {
      this.router.navigate(['/access-denied']);
    }
  }

  loadUnits(): void {
    this.unitService.getAll()
      .pipe(
        map(units => units.filter(unit => unit.status === Status.ENABLED))
      )
      .subscribe(
        units => {
          this.units = units;
        },
        error => {
          console.error('Error loading units', error);
          // Potresti voler gestire l'errore in modo specifico qui
        }
      );
      this.extractMonths();
      // Chiamare onStatusChange con il valore iniziale del form
      this.onStatusChange(this.form.get('status.value')!.value);
      this.getProjectsLoad(this.currentUnitIndex, this.projectStatus, this.pageable);
  }

  extractMonths(): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;

    this.unitService.getProjectLoad(this.currentUnitIndex, this.currentYear, this.projectStatus).subscribe((response: ApiResponse) => {
      const monthsMap = new Map<number, Set<number>>();
      this.totalElements = response.totalElements;

      let maxMonthsProject = response.content[0]; // Inizializza al primo progetto
      let maxMonthsCount = 0;

      // Trova l'oggetto con il massimo numero di mesi in base ai dati effettivi
      response.content.forEach(projectLoad => {
        const monthsCount = Object.keys(projectLoad.actualCostPct).length;
        if (monthsCount > maxMonthsCount) {
          maxMonthsCount = monthsCount;
          maxMonthsProject = projectLoad;
        }
      });

      // Aggiungi le settimane dal progetto con il massimo numero di mesi
      Object.keys(maxMonthsProject.actualCostPct).forEach(month => {
        const monthNumber = parseInt(month);
        const weekNumbers = Object.keys(maxMonthsProject.actualCostPct[monthNumber])
          .map(week => parseInt(week))
          .sort((a, b) => a - b);

        if (weekNumbers.length > 0) {
          if (!monthsMap.has(monthNumber)) {
            monthsMap.set(monthNumber, new Set<number>());
          }
          weekNumbers.forEach(week => monthsMap.get(monthNumber)!.add(week));
        }
      });

      // Aggiungi le settimane di tutti gli altri progetti
      response.content.forEach(projectLoad => {
        Object.keys(projectLoad.actualCostPct).forEach(month => {
          const monthNumber = parseInt(month);
          const weekNumbers = Object.keys(projectLoad.actualCostPct[monthNumber] || {})
            .map(week => parseInt(week))
            .sort((a, b) => a - b);

          if (weekNumbers.length > 0) {
            if (!monthsMap.has(monthNumber)) {
              monthsMap.set(monthNumber, new Set<number>());
            }
            weekNumbers.forEach(week => monthsMap.get(monthNumber)!.add(week));
          }
        });
      });

      this.months = [];
      Array.from(monthsMap.keys()).sort((a, b) => a - b).forEach(monthNumber => {
        const monthName = this.getMonthName(monthNumber);
        let weeks = Array.from(monthsMap.get(monthNumber)!).sort((a, b) => a - b);

        // Se il mese è dicembre e la sequenza va da 1 a 52, riordiniamo le settimane
        if (monthNumber === 12 && weeks.length === 52 && weeks[0] === 1 && weeks[weeks.length - 1] === 52) {
          weeks = [...weeks.slice(1), weeks[0]]; // Muove il 1 alla fine
        }

        // Aggiungi il codice qui
        // Gestione del caso speciale di "1" e "52" per il mese di dicembre
        if (monthNumber === 12) {
          const indexOfOne = weeks.indexOf(1);
          const indexOfFiftyTwo = weeks.indexOf(52);
          if (indexOfOne !== -1 && indexOfFiftyTwo !== -1) {
            weeks = weeks.filter(week => week !== 1); // Rimuovi "1" dall'array
            weeks.splice(indexOfFiftyTwo + 1, 0, 1); // Inserisci "1" dopo "52"
          }
        }

        this.months.push({
          name: monthName,
          weeks,
          isCurrentMonth: monthNumber === this.currentMonth,
          index: this.getMonthIndex(monthName)
        });
        this.firstHeaderRow.push(monthName + '-header');
        this.displayedColumns.push(monthName);
      });
    });
  }

  onUnitChange(unitId: number): void {
    this.currentUnitIndex = unitId;
    this.getProjectsLoad(this.currentUnitIndex, this.projectStatus, this.pageable);
  }

  isOddRow(index: number): boolean {
    return (index % 4 === 0 || index % 4 === 1);
  }

  isOddRowReverse(index: number): boolean {
    return ((index + 2) % 4 === 0 || (index + 2) % 4 === 1);
    }
    
  onStatusChange(selectedValues: any[]): void {
    this.allOptionSelected = selectedValues.includes('');
    this.allOptionDisabled = selectedValues.length > 0 && !this.allOptionSelected;
    this.projectStatus = selectedValues;
    this.getProjectsLoad(this.currentUnitIndex, this.projectStatus, this.pageable);
  }

  getObjectKeys(obj: any, i: number): string[] {
    return Object.keys(obj[i]);
  }

  parseMonth(month: string): number {
    return parseInt(month, 10);
  }

  // Funzione per restituire la classe CSS corrispondente in base alla percentuale
  getPctColorClass(percent: number): string {
    if (percent >= 100) {
      return 'bg-danger';
    } else if (percent >= 70) {
      return 'bg-success';
    } else if (percent >= 30) {
      return 'bg-warning'; // Personalizza il colore arancione
    } else {
      return 'bg-danger';
    }
  }

  getMonthName(monthNumber: number): string {
    return this.monthsList[monthNumber - 1];
  }

  getMonthIndex(monthName: string): number {
    return this.monthsList.indexOf(monthName) + 1;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      resource: new FormGroup({
        id: new FormControl('')
      }),
      unit: new FormGroup({
        id: new FormControl(0)
      }),
      status: new FormGroup({
        value: new FormControl(['']) // Inizializzato con "All" selezionato
      })
    });
  }

  getProjectsLoad(id: string | number, projectStatus: string[], pageable: PagingAndSortingCriteria): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();

    this.unitService.getProjectLoad(id, this.currentYear, projectStatus, pageable).subscribe((response: ApiResponse) => {
      this.projectsLoad = [];
      this.totalElements = response.totalElements;

      response.content.forEach(projectLoad => {
        if ((Object.keys(projectLoad.actualCostPct[12]).length !== 0)) {
            const invertWeeklyCost = (weeklyCost: { [week: number]: number }) => {
                const invertedCost: { [week: number]: number } = {};
                const firstWeekValue = weeklyCost[1] || null;

                if (firstWeekValue !== null) {
                    delete weeklyCost[1];
                }

                Object.entries(weeklyCost).forEach(([week, value]) => {
                    let newWeek = parseInt(week) - 1;
                    if (newWeek === 0) {
                        newWeek = 52;
                    }
                    invertedCost[newWeek] = value;
                });

                if (firstWeekValue !== null) {
                    invertedCost[52] = firstWeekValue;
                }

                return invertedCost;
            };

            projectLoad.actualCostPct[12] = invertWeeklyCost(projectLoad.actualCostPct[12]);
            projectLoad.estimatedCostPct[12] = invertWeeklyCost(projectLoad.estimatedCostPct[12]);

            if (projectLoad.estimatedCost && projectLoad.estimatedCost[12]) {
                projectLoad.estimatedCost[12] = invertWeeklyCost(projectLoad.estimatedCost[12]);
            }
        }
      });

      response.content.forEach(projectLoad => {
        this.projectsLoad.push({
          ...projectLoad,
          cw: 'EC'
        });
        this.projectsLoad.push({
          ...projectLoad,
          cw: 'AC'
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

  onPageChange(pageEvent: any): void {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageable = {
      page: this.currentPage,
      size: this.pageSize
    };
    this.getProjectsLoad(this.currentUnitIndex, this.projectStatus, this.pageable);
  }
}
