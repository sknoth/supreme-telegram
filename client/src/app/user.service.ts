import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private userUrl = 'http://localhost:8080/users/';

  constructor(
    private _http: Http
  ) { }

  addUser(user) {
    console.log('addUser', user);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.userUrl, user, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateUser(id, user) {
    console.log('updateUser', id, user);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.userUrl + id, user, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getUser(id) {
    console.log('getUser', this.userUrl + id);
    return this._http.get(this.userUrl + id)
                  .map(data => { return data.json(); })
                  .catch(this.handleError);
  }

  getUsers() {
    return this._http.get(this.userUrl)
                  .map(data => { return data.json().users; })
                  .catch(this.handleError);
  }


  private extractData(res: Response) {
    console.log('extractData');

    let body = res.json();

    return body.user || { };
  }

  private handleError (error: Response | any) {
    console.log('handleError');
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
