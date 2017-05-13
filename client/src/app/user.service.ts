import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Subject }    from 'rxjs/Subject';

import {IUser} from "./admin.interfaces";

@Injectable()
export class UserService {

  private userUrl = 'http://localhost:8080/users';
  private serverUrl = 'http://localhost:3000';
  // Observable user
  private user:IUser;

  constructor(
    private _http: Http
  ) { }

  setUser(user: IUser) {
    this.user = user;
  }

  getUser() {
    console.log(this.user);
    return this.user;
  }

  addUser(user) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.serverUrl + "/user", user, options)
                    .map(res => { return  res.json()})
                    .catch(this.handleError);


  }

  getUserById(userId) {
    return this._http.get(this.serverUrl + '/users/' + userId)
      .map(data => { return data.json(); })
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();

    console.log('extractData', body);
    return body.data || { };
  }

  getUsers() {
    return this._http.get(this.userUrl)
                  .map(data => { return data.json().users; })
                  .catch(this.handleError);
  }

  updateUser(userId, user) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.serverUrl + "/user/" + userId, user, options)
                    .map(res => { return  res.json()})
                    .catch(this.handleError);
  }


  private handleError (error: Response | any) {
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
