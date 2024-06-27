import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { FileService } from '@shared/services/timesheets-test.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-import-resources-form',
  templateUrl: './import-resources-form.component.html',
  styleUrls: ['./import-resources-form.component.scss']
})
export class ImportResourcesFormComponent implements OnInit{
  fileName: string = '';
  uploadingFile: boolean = false;
  uploadProgress: number = 0;
  errorMessage: string[] = [];
  permissions: boolean = false;

  constructor(private readonly service: FileService, 
    private readonly router: Router, 
    private readonly roleService: RolePermissionService) { }

  ngOnInit(): void {
    this.checkPermissions();
  }

  checkPermissions(): void {
    this.permissions = this.roleService.hasPermission(ROLE_VISIBILITY.IMPORT);
    if (this.permissions == false) {
      this.router.navigate(['/access-denied']);
    }
  }

  csvInputChange(event: any) {
    const file: File = event.target.files[0];
    this.uploadFile(file);
  }

  uploadFile(file: File) {
    this.resetUpload(); // Reset before new upload
    this.fileName = file.name;
    this.uploadingFile = true;

    const data = this.service.sendResourceFiles(file);

    data.subscribe({
      next: (response: string) => {
        console.log('Response from server:', response);

        if (response === "File uploaded successfully") {
          this.fetchEvents();
        } else {
          console.error('Unexpected response:', response);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.uploadingFile = false;
      }
    });
  }

  fetchEvents() {
    this.service.getResourcesEvents().pipe(map(x => x)).subscribe({
      next: async (text) => {
        const lines = text.split('\n');

        for await (const chunk of lines) {
          if (chunk.startsWith('data:')) {
            const jsonText = chunk.substring(5);
            try {
              const json = JSON.parse(jsonText);
              console.log("Parsed JSON:", json);

              if (json && json.progress !== undefined) {
                this.uploadProgress = json.progress;
              }

              if (json && json.message) {
                this.errorMessage.push(json.message);
              }

            } catch (error) {
              console.error("Error parsing JSON object:", error);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
      complete: () => {
        console.log('Event fetching completed');
      }
    });
  }

  getErrorMessageContent(): string {
    return this.errorMessage && this.errorMessage.length > 0 ? this.errorMessage.map(e => e?.trim()).join('\n') : '';
  }

  resetUpload() {
    this.fileName = '';
    this.uploadingFile = false;
    this.uploadProgress = 0;
    this.errorMessage = [];
  }

  cancelUpload() {
    this.resetUpload();
  }
}
