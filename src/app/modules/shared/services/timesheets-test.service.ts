import { Injectable } from '@angular/core';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, mergeAll, switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '@environment/environment';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private uploadUrl = environment.endpoints.timesheetsTest + 'imports';
  private eventsUrl = environment.endpoints.timesheetsTest + 'imports/events';
  private uploadResourcesUrl = environment.endpoints.resourcesImport + 'imports';
  private eventsResourcesUrl = environment.endpoints.resourcesImport + 'imports/events';

  

  private getAuthHeaders(): Headers {
  
    let token = null;
    const userStored = localStorage.getItem('user');

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

  sendFiles(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new Request(this.uploadUrl, {
      method: 'POST',
      body: formData,
      headers: this.getAuthHeaders()
    });

    return fromFetch(req).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.text();  // Convert the response to text
        } else {
          return throwError('Failed to upload file');
        }
      })
    );
  }

  getEvents(): Observable<string> {
    const headers = new Headers(this.getAuthHeaders());
    headers.append('Content-Type', 'text/event-stream');
  
    const req = new Request(this.eventsUrl, {
      method: 'GET',
      headers: headers
    });
  
    return fromFetch(req).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.text();
        } else {
          return throwError('Failed to fetch events');
        }
      })
    );
  }
  
  
  sendResourceFiles(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new Request(this.uploadResourcesUrl, {
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

  getResourcesEvents(): Observable<any> {
    const headers = new Headers(this.getAuthHeaders());
    // headers.append('Content-Type', 'text/event-stream');
  
    const req = new Request(this.eventsResourcesUrl, {
      method: 'GET',
      headers: headers
    });
  
    return fromFetch(req).pipe(
      map(response => {
        return response.text();
      }), 
      mergeAll(),
      catchError((response) => of('Failed to fetch events'))
    );
  }
}


