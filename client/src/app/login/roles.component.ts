/**
 * Created by asoadmin on 2017-05-04.
 */
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import { UserService } from '../user.service';
import { ChatService } from '../chat.service';
import { GameStore } from '../state/game.store';

import { IUser } from "../admin.interfaces";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {MdDialog, MdDialogRef} from '@angular/material';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class RolesComponent implements OnInit {

  name:string;
  surname:string;
  scenarioId:string;
  role:string;
  doctor:string;
  location:{x:Number,y:Number};

  leader_disabled = false;

  user:IUser;

  // game: IGame;

  constructor(
    @Inject(FormBuilder) _formBuilder : FormBuilder,
    private _userService: UserService,
    private _chatService:ChatService,
    private _gameStore: GameStore,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog
  ) {

    this._chatService.connect();

    // this._chatService.getMessages().subscribe(message => {
    //
    //    console.log('_chatService message', message);
    //
    //    if(message['topic'] === "join-game") {
    //
    //      console.log("ROSES Join Game",message['data']);
    //     //  this.game = message['data'];
    //
    //
    //    }
    // });


    //reading route parameters
    this.route.params.subscribe(params => {
      this.name = params['name'];
      this.surname = params['surname'];
      this.scenarioId = params['scenario'];
      this.location = {x:0,y:0};
    })

    this._gameStore.game.debounceTime(1000).subscribe((game) => {
      console.log('Game in Roles cmp', game);
      if (game.leader) {
        console.log('game.leader', game.leader);
        this.leader_disabled = true;
      }
    });
  }

  ngOnInit() {

  }

  /**
   * Set users role
   * @param role - is string
   */
  setRole(role) {
     //console.log(role);
     this.role = role;

     if (this.role === "NURSE") {
       this.openDialog();
     }
     else {
       this.location = {x:280,y:276};
       this.logIn();
     }

  }

  openDialog() {

    let dialogRef = this.dialog.open(DoctorDialogComponent);
    dialogRef.afterClosed().subscribe(result => {

      this.doctor = result;
      this.logIn();
    });
  }

  logIn(){

    let user : IUser = {
      name:this.name,
      surname:this.surname,
      scenarioId:this.scenarioId,
      role:this.role,
      location:this.location
    }

    //create user
    this._userService.addUser(user).subscribe((v)=>{

      //notify all
      this._chatService.sendMessage("login", JSON.stringify({
        user:v,
        scenarioId:this.scenarioId,
        doctor:this.doctor
      }));

      this._userService.setUser(v);

      //show gamemap view
      this.router.navigate(['/gamemap',this.scenarioId]);
    });

  }

}


@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
})

export class DoctorDialogComponent {
  constructor(public dialogRef: MdDialogRef<DoctorDialogComponent>) {}
}
