import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, mergeAll, switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CompanyLicenceService extends HttpBaseService<CompanyLicence> {

  private uploadUrl = environment.endpoints.companyLicences;


  constructor(injector: Injector) {
    super(injector, environment.endpoints.companyLicences);
  }


  sendEmail(id: string | number | undefined) : Observable<CompanyLicence> {
    return this.request<CompanyLicence>(`${id}/send-email`, METHODS.POST);
  }


  private getAuthHeaders(): Headers {
  
    let token = null;
    const userStored = localStorage.getItem('encryptedUser');

    if(userStored !== null) {
      const user = JSON.parse(userStored)

      if(user && user.authentication) {
        token = user.authentication
      }
    }
    return new Headers({
      'Authorization': `Bearer ${token}`
    });
  }

  
  sendFiles(file: File, companyLicenceId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.uploadUrl}${companyLicenceId}/upload`;


    const req = new Request(url, {
      method: 'POST',
      body: formData,
      headers: this.getAuthHeaders()
    });

    return fromFetch(req).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.text(); 
        } else {
          return throwError('Failed to upload file');
        }
      })
    );
  }


}
