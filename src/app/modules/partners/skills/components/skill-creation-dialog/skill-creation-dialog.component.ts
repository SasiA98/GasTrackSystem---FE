import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Skill } from '@shared/models/skill.model';
import { SkillsService } from '@shared/services/skills.service';
import { SkillGroup } from '@shared/models/skill-group.model';
import { SkillGroupsService } from '@shared/services/skill-group.service';
import { Observable, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-skills-creation-dialog',
  templateUrl: './skill-creation-dialog.component.html',
  styleUrls: ['./skill-creation-dialog.component.scss']
})
export class SkillCreationDialogComponent{
  form: FormGroup;
  skill: FormControl = new FormControl();
  skillGroups : SkillGroup[] = []
  filteredGroupsSkill?: Observable<SkillGroup[]> = of([]);

  constructor(
    public dialogRef: MatDialogRef<SkillCreationDialogComponent>,
    private readonly skillService: SkillsService,
    private readonly skillGroupService: SkillGroupsService,
    @Inject(MAT_DIALOG_DATA) public skillData: Skill
  ) {
    this.form = this.createForm();
    this.skillGroupService.getAll().subscribe((skillGroups) => {
      this.skillGroups = skillGroups;
      this.initializeAutocomplete();
      this.setSkillGroup();
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

  private initializeAutocomplete(): void {
    this.filteredGroupsSkill = this.form.get('skillGroup')?.get('id')?.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.skillGroups.slice())),
    );
  }

  private setSkillGroup(): void {
    this.form.patchValue({
      id: this.skillData.id,
      name: this.skillData.name,
      skillGroup: {
        id: this.skillData.skillGroup.id
      }
    });
  }

  private createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      skillGroup: new FormGroup({
        id: new FormControl(''),
      }),
      name: new FormControl(''),
    });
  }


  onSubmit(): void {
      const name = this.form.get('name')?.value;
      const skillGroupId = this.form.get('skillGroup')?.get('id')?.value;
      const skillgroup = { id: skillGroupId } as SkillGroup;

      const skill: Skill = {
        name: name,
        skillGroup: skillgroup
      };
      if (this.skillData != null && this.skillData.id) {
        this.skillService.update(this.skillData.id, skill).subscribe(
          () => {
            this.dialogRef.close(skill);
          },
          (error) => {
            console.log(error);
          }
        );
      } else if (name != '') {
      this.skillService.save(skill).subscribe(
        () => {
          this.dialogRef.close(skill);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
