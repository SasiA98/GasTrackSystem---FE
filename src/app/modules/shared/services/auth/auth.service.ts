import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import { Subject } from 'rxjs';
import { BaseUser } from 'src/app/base/authentication/models/base-user.model';
import { BaseAuthService } from 'src/app/base/authentication/services/base-auth.service';
import { LogicalOperator } from 'src/app/base/authentication/types/logical-operator.type';
import { Memoize } from 'typescript-memoize';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService {
  userLoggedIn: Subject<boolean> = new Subject<boolean>();
  private encryptionKey = 'Qs23RBNF330ms00n';

  constructor(private readonly router: Router) {
    super();
  }


  login(): void {
    this.router.navigate(['auth']);
  }


  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    this.userLoggedIn.next(false);
    this.login();
  }


  isLogged(): boolean {
    return !!localStorage.getItem('user');
  }


  storeUser<U extends BaseUser>(encryptedUser: U): void {
    var user : string = this.decrypt(encryptedUser);
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('encryptedUser', JSON.stringify(encryptedUser));

    this.userLoggedIn.next(true);
  }


  getStoredUsed(): AuthenticatedUser | undefined {

    const storedUser = localStorage.getItem('user');
    return storedUser ? (JSON.parse(storedUser) as AuthenticatedUser) : undefined;
  }

  getEncryptedStoredUsed(): AuthenticatedUser | undefined {

    const storedUser = localStorage.getItem('encryptedUser');
    return storedUser ? (JSON.parse(storedUser) as AuthenticatedUser) : undefined;
  }


  decrypt(encryptedData: any): any {

    var jwt : string = encryptedData['authentication'];

    var keyForCryptoJS = CryptoJS.enc.Utf8.parse(this.encryptionKey);
    
    var encryptString = jwt;
    var decodeBase64 = CryptoJS.enc.Base64.parse(encryptString)
    
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: decodeBase64
    });

  
    var decryptedData = CryptoJS.AES.decrypt(
      cipherParams,
      keyForCryptoJS,
      {
        mode: CryptoJS.mode.ECB
      }
    );
  
    var decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);

    console.log( `decryptedText = '${new String(decryptedText)}'`);

    return { 
      'authentication' : decryptedText
    };
  }


  @Memoize((roles: string[], user: AuthenticatedUser, logicalOperator: LogicalOperator) => {
    return `${roles.toString()}:${user.roles?.toString()}:${logicalOperator.toString()}`;
  })
  override hasRole<U extends BaseUser>(
    roles: string[],
    user: U,
    logicalOperator: LogicalOperator
  ): boolean {
    return super.hasRole(roles, user, logicalOperator);
  }

  
}
