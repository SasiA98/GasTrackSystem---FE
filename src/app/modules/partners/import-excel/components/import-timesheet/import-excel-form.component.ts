import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { FileService } from '@shared/services/timesheets-test.service';

export class Flux {
  message: string | undefined;
}

@Component({
  selector: 'app-import-excel-form',
  templateUrl: './import-excel-form.component.html',
  styleUrls: ['./import-excel-form.component.scss'],
})
export class ImportFormComponent {
  fileName: string = '';
  uploadingFile: boolean = false;
  uploadProgress: number = 0;
  transfers: { fileName: string, timestamp: Date }[] = [];
  flux: string[] = ['ciao', 'ciao1', 'ciao2'];
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
    
    this.fileName = file.name;
    this.uploadingFile = true;

    const data = this.service.sendFiles(file);

    data.subscribe({
      next: (response: string) => {
        console.log('Response from server:', response);

        if (response === "File uploaded successfully") {
          this.fetchEvents();
          this.transfers.push({ fileName: this.fileName, timestamp: new Date() });
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
    this.service.getEvents().subscribe({
      next: (text) => this.processResponse(text),
      error: (err) => {
        console.error('Error fetching events:', err);
      },
      complete: () => {
        console.log('Event fetching completed');
      }
    });
  }
  
  processResponse(text: string) {
    try {
      const lines = text.split('\n');
  
      lines.forEach(line => {
        if (line.startsWith('data:')) {
          const jsonText = line.substring(5);
          try {
            const json = JSON.parse(jsonText);
  
            if (json && json.progress !== undefined) {
              this.uploadingFile = true;
              this.uploadProgress = json.progress;
            }
  
            if (json && json.message) {
              this.errorMessage.push(json.message);
            }
  
          } catch (error) {
            console.error("Error parsing JSON object:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error processing response:", error);
    }
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
