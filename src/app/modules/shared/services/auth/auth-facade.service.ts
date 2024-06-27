import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import { EMPTY, Observable, of } from 'rxjs';
import { BaseAuthFacadeService } from 'src/app/base/authentication/services/facade/base-auth-facade.service';
import { Memoize } from 'typescript-memoize';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService extends BaseAuthFacadeService {
  constructor(private readonly jwtHelperService: JwtHelperService) {
    super();
  }

  getUser(): Observable<AuthenticatedUser> {
    const user = localStorage.getItem('user');
    if (user) {
      return of(this.decodeJWT(JSON.parse(user)));
    }
    return EMPTY;
  }

  @Memoize()
  private decodeJWT(user: AuthenticatedUser): AuthenticatedUser {
    const authenticatedUser = this.jwtHelperService.decodeToken<AuthenticatedUser>(user.authentication);
    authenticatedUser.roles = authenticatedUser.authorities;
    return authenticatedUser;
  }
}
