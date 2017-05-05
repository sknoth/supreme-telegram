import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import {ChatService} from '../chat.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MdDialog} from "@angular/material";
import {IGame, IUser} from "../admin.interfaces";

@Component({
  selector: 'app-gamemap',
  templateUrl: './gamemap.component.html',
  styleUrls: ['./gamemap.component.scss']
})
export class GamemapComponent implements OnInit {

  user:IUser;
  scenarioId:string;
  game:IGame;

  constructor(private _userService: UserService, private _chatService:ChatService,private router: Router,private route: ActivatedRoute,public dialog: MdDialog) { }

  ngOnInit() {

    //reading route parameters
    this.route.params.subscribe(params=>{
      this._userService.getUserById(params['userId']).subscribe((user)=>{
        this.user = <IUser>user;
        console.log(this.user);
      });
      this.scenarioId = params['scenarioId'];

    });

    //TODO: show the map + leader/nurse on it with the leader/team name as it was shown on the paper prototype
    // show notification waiting for others to be log in
    // make the gamemap view as in the paper prototype for leader
    // make the gamemap view for nurses: visualize the map, users on the map, header is same as in leader gamemapview


    this._chatService.connect();

    this._chatService.getMessages().subscribe((message)=>{
       console.log("message");

       if(message['topic'] === "game-start"){
         // TODO: remove the notification waiting for others to be log in
         // TODO: show notificaiton game started!
         console.log("GAME START");
         this.game = message['data'];
         console.log(this.game);
         //TODO:Start timer
         //show for leader availbale teams take this data from this.game object


       }

    });
  }




}
