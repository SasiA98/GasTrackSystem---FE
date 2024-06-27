import { Injector } from "@angular/core";
import { Observable } from "rxjs";
import { METHODS } from "../enums/methods.enum";
import { AdvancedSearchCriteria } from "../models/advanced-search/advanced-search-criteria.model";
import { AdvancedSearchSimpleCriteria } from "../models/advanced-search/advanced-search-simple-criteria.model";
import { BaseModel } from "../models/base-model.model";
import { HttpRequestBaseService } from "./http-request-base.service";

export abstract class HttpBaseService<M extends BaseModel> extends HttpRequestBaseService {

    constructor(injector: Injector, baseUrl?: string) {
        super(injector, baseUrl)
    }
    
    get(id: number | string): Observable<M> {
        return this.request<M>(id.toString(), METHODS.GET);
    }
    getAll(params?: any): Observable<M[]> {
        return this.request<M[]>('', METHODS.GET, {}, params);
    }
    save(model: M): Observable<M> {
        return this.request<M>('', METHODS.POST, model);
    }
    saveAll(model: M[]): Observable<M[]> {
        return this.request<M[]>('', METHODS.POST, model);
    }
    update(id: number | string, model: M): Observable<M> {
        return this.request<M>(id.toString(), METHODS.PUT, model);
    }
    patch(id: number | string, model: Partial<M>): Observable<M> {
        return this.request<M>(id.toString(), METHODS.PATCH, model);
    }
    delete(id: number | string): Observable<M | void> {
        return this.request<M>(id.toString(), METHODS.DELETE);
    }
    find<S>(criteria?: { [key: string]: any; }): Observable<S> {
        return this.request<S>('search', METHODS.POST, criteria);
    }
    advancedSearch<S>(criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria, params?: {
        [key: string]: any;
    }): Observable<S> {
        let finalUrl = 'advanced-search' + this.getParams(params);
        return this.request<S>(finalUrl, METHODS.POST, criteria)
    }
}