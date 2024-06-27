import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SkillGroup } from '@shared/models/skill-group.model';
import { Skill } from '@shared/models/skill.model';
import { ResourceService } from '@shared/services/resource.service';
import { SkillGroupsService } from '@shared/services/skill-group.service';
import { SkillsService } from '@shared/services/skills.service';
import { ResourceSkillModel } from '@shared/models/resource-skill.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-resource-skill-dialog',
  templateUrl: './resource-skill-dialog.component.html',
  styleUrls: ['./resource-skill-dialog.component.scss']
})
export class ResourceSkillDialogComponent implements OnInit {

  displayedColumns: string[] = ['skillGroup', 'skill', 'rating', 'actions'];
  dataSource = new MatTableDataSource<Skill>();
  form: FormGroup;
  skills: Skill[] = [];
  filteredSkills?: Observable<Skill[]> = of([]);
  resourceName = '';
  dataSkill: any;
  stars: number[] = [1, 2, 3, 4, 5];
  starsReverse: number[] = this.stars.slice().reverse();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private ref: MatDialogRef<ResourceSkillDialogComponent>,
    private readonly skillsService: SkillsService,
    private readonly skillGroupService: SkillGroupsService,
    private readonly resourceService: ResourceService,
    private readonly translateService: TranslateService,
    private readonly toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { skillData: Skill[], resourceId: string | number, resourceName: string }
  ) {
    this.resourceName = this.data.resourceName;
    this.form = this.createForm();
    this.getAllSkills();
    this.resourceService.getSkillsByResourceId(this.data.resourceId).subscribe((skill) => this.dataSkill = skill);
  }

  displayFn(skill: number): string {
    const s = this.skills.find(s => s.id === skill);
    return s && s.name ? s.name : '';
  }

  private _filter(name: string): Skill[] {
    const filterValue = name.toLowerCase();

    return this.skills.filter(skill => skill.name.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    if (this.data && this.data.skillData) {
      this.dataSource.data = this.data.skillData;
    }
  }

  private createForm(): FormGroup {
    return new FormGroup({
      skill: new FormGroup({
        id: new FormControl(''),
      }),
      skillGroup: new FormGroup({
        id: new FormControl(''),
      }),
      rating: new FormControl(''),
    });
  }

  onSubmit(): void {
    const skillId = this.form.get('skill')?.get('id')?.value;
    const rating = this.form.get('rating')?.value;
    const skill_submit = { rating: rating } as ResourceSkillModel;
    if (skillId) {
      if (skill_submit) {
        this.resourceService.addOrUpdateSkill(this.data.resourceId, skillId, skill_submit).subscribe(
          () => {
            this.resourceService.getSkillsByResourceId(this.data.resourceId).subscribe((skill) => this.dataSkill = skill);
            this.showSuccessMessage();
          },
          (error) => {
            console.log(error);
          }
        );
        this.reset();
      }
    }
  }

  reset() {
    this.form.reset();
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.setErrors(null);
    });
    const skillGroupControl = this.form.get('skillGroup')?.get('id');
    const skillControl = this.form.get('skill')?.get('id');

    if (skillGroupControl) {
      skillGroupControl.setErrors(null);
      skillControl?.setErrors(null);
    }

    this.initializeSkillFilter();
  }

  private getAllSkills() : void {
    this.skillsService.getAllSkills().subscribe((skill) => {
      this.skills = skill;
      this.initializeSkillFilter();
    });
  }

  private initializeSkillFilter(): void {
    this.filteredSkills = this.form.get('skill')?.get('id')?.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.skills.slice())),
    );
  }


  deleteRow(row: any): void {
    this.resourceService.deleteSkillByResourceId(this.data.resourceId, row.skill.id).subscribe(
      () => {
        this.resourceService.getSkillsByResourceId(this.data.resourceId).subscribe((skill) => this.dataSkill = skill);
        this.showSuccessMessage();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sortData(): void {
    this.dataSource.sort?.sort({
      id: 'skill',
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
  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }
}
