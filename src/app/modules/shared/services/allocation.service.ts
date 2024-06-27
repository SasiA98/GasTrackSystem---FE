import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Allocation } from '@shared/models/allocation.model';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AllocationService extends HttpBaseService<Allocation> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.allocations);
  }

  convert(id: string | number | undefined, fromRealToSale: boolean) : Observable<Allocation> {
      console.log(fromRealToSale);
      return this.request<Allocation>(`${id}/convert?fromRealToSale=${fromRealToSale}`, METHODS.PUT);
  }

}
