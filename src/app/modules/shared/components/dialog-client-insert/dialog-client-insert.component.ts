import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../dialog/dialog.component';
import { ProfileService } from '@shared/services/profile.service';
import { Observable, take } from 'rxjs';
@Component({
  selector: 'app-dialog-client-insert',
  templateUrl: './dialog-client-insert.component.html',
  styleUrls: ['./dialog-client-insert.component.scss']
})
export class DialogClientInsertComponent implements OnInit {
  model: any;
  idModel: any;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private readonly toastrService: ToastrService,
    private readonly profileService: ProfileService,
    @Inject(MAT_DIALOG_DATA) public data: { text: string }
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.profileService.get().pipe(take(1)).subscribe(user => {
      this.model = user;
      this.idModel = user.id;
    });
  }

}
