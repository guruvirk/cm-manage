import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { RoleService } from './role.service';
import { Observable } from 'rxjs';
import { UxService } from './ux.service';
import { Query } from './models';
import { Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private _api: GenericService<Query>;

  constructor(private http: HttpClient,
    private roleService: RoleService,
    private uxService: UxService) {
    this._api = new GenericService(this.http, this.roleService, this.uxService);
  }

  search(query): Observable<Page<Query>> {
    return this._api.search(`queries`, query)
  }

}
