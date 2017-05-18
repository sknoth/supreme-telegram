import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { GameService } from '../game.service';

import {IGame} from '../admin.interfaces';

@Injectable()
export class GameStore {

  private _game: BehaviorSubject<IGame>;

  constructor(private _gameService: GameService) {

    this._game = <BehaviorSubject<IGame>> new BehaviorSubject({
      totalActions: 0,
      timeSpend: '',
    });

    //  this.loadGame();
   }

   get game() {
     return this._game.asObservable();
   }




   loadGame(id: any, callback?) {
     console.log('loadGame', id);

     // save id in localstorage so its not lost on refresh?

     this._gameService.getGameById(id).subscribe(
       result => {
         this._game.next(result.data);

           console.log('this._game',this._game);
           callback;
       },
       error => console.log('ERROR getting Game')
     );
   }
}
