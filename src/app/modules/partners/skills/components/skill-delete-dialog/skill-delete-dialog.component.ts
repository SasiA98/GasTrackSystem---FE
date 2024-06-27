import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Skill } from '@shared/models/skill.model';
import { SkillsService } from '@shared/services/skills.service';

@Component({
  selector: 'app-skill-delete-dialog',
  templateUrl: './skill-delete-dialog.component.html',
  styleUrls: ['./skill-delete-dialog.component.scss']
})
export class SkillDeleteDialogComponent {

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly skillsService: SkillsService,
    public dialogRef: MatDialogRef<SkillDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public skill: Skill) {

  }


  onSubmit(): void {

    var skill_id = this.skill.id;

    if (skill_id != null) {
    this.skillsService.deleteSkillById(skill_id).subscribe(
      () => {
        this.showSuccessMessage();
        this.closeDialog();
      }, error => {
        console.log(error);
      });
    } else {
      this.toastrService.error("User doesn't have permissions", "Error");
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }



}
