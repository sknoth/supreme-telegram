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

    this._chatService.connect();

    this._chatService.getMessages().subscribe((message)=>{
       console.log("message");

       if(message['topic'] === "game-start"){
         console.log("GAME START");
         this.game = message['data'];
         console.log(this.game);
       }

    });
  }




}
