import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillGroup } from '@shared/models/skill-group.model';
import { SkillGroupsService } from '@shared/services/skill-group.service';

@Component({
  selector: 'app-skills-creation-dialog',
  templateUrl: './skill-group-creation-dialog.component.html',
  styleUrls: ['./skill-group-creation-dialog.component.scss']
})
export class SkillGroupCreationDialogComponent{
  form: FormGroup;
  skillGroup: FormControl;
  skillGroups: any = [];

  constructor(
    public dialogRef: MatDialogRef<SkillGroupCreationDialogComponent>,
    private readonly skillGroupService: SkillGroupsService,
    @Inject(MAT_DIALOG_DATA) public isDelete: boolean
  ) {
    this.form = this.createForm();
    this.skillGroup = new FormControl();
  } 


  private createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
    });
  }

  

  onSubmit(): void {
    const name = this.form.get('name')?.value;
    const skillGroup: SkillGroup = {
      name: name
    };
    if (name != '') {
      this.skillGroupService.save(skillGroup).subscribe(
        () => {
          this.dialogRef.close(skillGroup);
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
