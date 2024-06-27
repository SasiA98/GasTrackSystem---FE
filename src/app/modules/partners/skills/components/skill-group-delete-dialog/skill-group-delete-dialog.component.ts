import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule }  from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Skill } from '@shared/models/skill.model';
import { Observable, map, of, startWith } from 'rxjs';
import { SkillsService } from '@shared/services/skills.service';
import { SkillGroup } from '@shared/models/skill-group.model';
import { SkillGroupsService } from '@shared/services/skill-group.service';

@Component({
  selector: 'app-skills-delete-dialog',
  templateUrl: './skill-group-delete-dialog.component.html',
  styleUrls: ['./skill-group-delete-dialog.component.scss']
})
export class SkillGroupDeleteDialogComponent{
  form: FormGroup;
  skillGroups: SkillGroup[] = [];
  filteredGroupsSkill?: Observable<SkillGroup[]> = of([]);

  constructor(
    public dialogRef: MatDialogRef<SkillGroupDeleteDialogComponent>,
    private readonly skillGroupService: SkillGroupsService,
    @Inject(MAT_DIALOG_DATA) public isDelete: boolean
  ) {
    this.form = this.createForm();
    this.skillGroupService.getAll().subscribe((skillGroups) => {
      this.skillGroups = skillGroups;
      this.filteredGroupsSkill = this.form.get('skillGroup')?.get('id')?.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => (name ? this._filter(name) : this.skillGroups.slice())),
      );
    });
  }

  displayFn(skillGroup: number): string {
    const s = this.skillGroups.find(s => s.id === skillGroup);
    return s && s.name ? s.name : '';
  }

  private _filter(name: string): SkillGroup[] {
    const filterValue = name.toLowerCase();

    return this.skillGroups.filter(skillGroup => skillGroup.name.toLowerCase().includes(filterValue));
  }


  private createForm(): FormGroup {
    return new FormGroup({
      skillGroup: new FormGroup({
        id: new FormControl(''),
      }),
    });
  }



  onSubmit(): void {
    const skillGroupId = this.form.get('skillGroup')?.get('id')?.value || '';
    if (skillGroupId) {
      this.skillGroupService.delete(skillGroupId).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error deleting skill group:', error);
          this.dialogRef.close(false);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
