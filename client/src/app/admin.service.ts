/**
 * Created by asoadmin on 2017-04-29.
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {DatatableSortType} from "ng2-md-datatable";
import { Scenario, PaginableScenarios } from './admin.interfaces';

@Injectable()
export class AdminService {

  private serverURL = 'http://localhost:3000';
  private scenarios: Scenario[];

  constructor(
    private _http: Http
  ) { }


  getScenarios(){
    console.log("Get all scenarios from database");
    return this._http.get(this.serverURL + "/scenarios")
      .map(data => {  return <Scenario[]>data.json().data; })
      .catch(this.handleError);
  }

  getScenariosData(allScenarios:Scenario[],page:number,limit:number,sortBy?:string,sortType?:DatatableSortType):PaginableScenarios{

    const offset = (page - 1) * limit;

    let scenarios;
    if(sortBy){
      scenarios = allScenarios.sort((scenario1: Scenario, scenario2: Scenario) => {
        switch (sortType) {
          case 0:
          case 1:
            return typeof (scenario1[sortBy]) === 'number' ?
              scenario1[sortBy] - scenario2[sortBy] :
              String.prototype.localeCompare.call(scenario1[sortBy], scenario2[sortBy]);
          case 2:
            return typeof (scenario1[sortBy]) === 'number' ?
              scenario2[sortBy] - scenario1[sortBy] :
              String.prototype.localeCompare.call(scenario2[sortBy], scenario1[sortBy]);
        }
      })
        .slice(offset, offset + limit);
    } else {
      scenarios = allScenarios.slice(offset, offset + limit);
    }

    return {
      scenarios,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalCount: scenarios.length,
      },
    };

  }





  /*example of post request
  addUser(user) {
    console.log('addUser', user);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.userUrl, user, options)
      .map(this.extractData)
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
   */
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
