import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class GameService {

  private serverUrl = 'http://localhost:3000';

  constructor(
    private _http: Http
  ) { }

  getGameById(scenarioId) {
    return this._http.get(this.serverUrl + '/game/' + scenarioId)
      .map(data => { return data.json(); });
  }

}
