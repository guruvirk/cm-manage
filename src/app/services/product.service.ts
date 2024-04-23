import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { RoleService } from './role.service';
import { Observable } from 'rxjs';
import { UxService } from './ux.service';
import { Product } from './models';
import { Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _api: GenericService<Product>;

  constructor(private http: HttpClient,
    private roleService: RoleService,
    private uxService: UxService) {
    this._api = new GenericService(this.http, this.roleService, this.uxService);
  }

  update(id: string, order): Observable<Product> {
    return this._api.update(`products/${id}`, order)
  }

  get(id): Observable<Product> {
    return this._api.get(`products/${id}`)
  }

  search(query): Observable<Page<Product>> {
    return this._api.search(`products`, query)
  }

}
