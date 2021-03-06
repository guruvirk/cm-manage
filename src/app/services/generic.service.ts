import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IAuth } from './auth.interface';
import { environment } from '../../environments/environment';
import { ServerData } from './models/server-data.model';
import { UxService } from './ux.service';
import { Page } from '../models';

export class GenericService<T> {

  constructor(
    private http: HttpClient,
    private _auth: IAuth,
    private uxService: UxService) { }

  create(url, model): Observable<T> {
    const subject = new Subject<T>();
    this.http
      .post<ServerData<T>>(`${environment.url}/${url}`, model, { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          try {
            if (dataModel.isSuccess) {
              subject.next(dataModel.data);
            } else {
              const err = dataModel.error || dataModel.code || dataModel.message || 'failed';
              this.handleError(err, subject)
              console.log(err)
            }
          }
          catch (err) {
            this.handleError(err, subject)
            console.log(err)
          }
        })
    return subject.asObservable();
  }

  post(url, model): Observable<any> {
    const subject = new Subject<any>();
    this.http
      .post<ServerData<any>>(`${environment.url}/${url}`, model, { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          try {
            if (dataModel.isSuccess) {
              subject.next(dataModel.data);
            } else {
              const err = dataModel.error || dataModel.code || dataModel.message || 'failed';
              this.handleError(err, subject)
              console.log(err)
            }
          }
          catch (err) {
            this.handleError(err, subject)
            console.log(err)
          }
        })
    return subject.asObservable();
  }

  get(url): Observable<T> {
    const subject = new Subject<T>();
    this.http
      .get<ServerData<T>>(`${environment.url}/${url}`, { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          try {
            if (dataModel.isSuccess) {
              subject.next(dataModel.data);
            } else {
              const err = dataModel.error || dataModel.code || dataModel.message || 'failed';
              this.handleError(err, subject)
              console.log(err)
            }
          }
          catch (err) {
            this.handleError(err, subject)
            console.log(err)
          }
        })
    return subject.asObservable();
  }

  search(url, obj): Observable<Page<T>> {
    const subject = new Subject<Page<T>>();
    this.http
      .get<ServerData<T>>(`${environment.url}/${url}?${new URLSearchParams(obj).toString()}`, { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          try {
            if (dataModel.isSuccess) {
              subject.next(dataModel.page);
            } else {
              const err = dataModel.error || dataModel.code || dataModel.message || 'failed';
              this.handleError(err, subject)
              console.log(err)
            }
          }
          catch (err) {
            this.handleError(err, subject)
            console.log(err)
          }
        })
    return subject.asObservable();
  }

  update(url, model): Observable<T> {
    const subject = new Subject<T>();
    this.http
      .put<ServerData<T>>(`${environment.url}/${url}`, model, { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          try {
            if (dataModel.isSuccess) {
              subject.next(dataModel.data);
            } else {
              const err = dataModel.error || dataModel.code || dataModel.message || 'failed';
              this.handleError(err, subject)
              console.log(err)
            }
          }
          catch (err) {
            this.handleError(err, subject)
            console.log(err)
          }
        })
    return subject.asObservable();
  }

  delete(url): Observable<T> {
    const subject = new Subject<T>();
    this.http
      .delete<ServerData<T>>(`${environment.url}/${url}`, { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          try {
            if (dataModel.isSuccess) {
              subject.next(dataModel.data);
            } else {
              const err = dataModel.error || dataModel.code || dataModel.message || 'failed';
              this.handleError(err, subject)
              console.log(err)
            }
          }
          catch (err) {
            this.handleError(err, subject)
            console.log(err)
          }
        })
    return subject.asObservable();
  }

  getHeaders(): HttpHeaders {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');


    if (this._auth) {

      const user = this._auth.currentUser();
      const tenant = this._auth.currentTenant();

      if (user && user.session && user.session.id) {
        headers = headers.set('x-session', user.session.id);
      }

      if ((tenant && tenant.code) || environment.tenant) {
        headers = headers.set('x-tenant', tenant ? tenant.code : environment.tenant);
      }

    }

    return headers
  }

  private handleError(err: any, subject: Subject<any>) {
    this.uxService.handleError(err)
    subject.error(err)
  }

}
