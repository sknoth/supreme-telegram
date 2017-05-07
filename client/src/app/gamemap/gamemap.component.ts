import {Component, OnInit, ElementRef, AfterViewInit, Renderer2, ViewChild} from '@angular/core';

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
export class GamemapComponent implements OnInit,AfterViewInit {

  user:IUser; //current user
  scenarioId:string;
  game:IGame;

  timer:{minutes:string,seconds:string};

  title = "Waiting for other users to be log in......"

  //UI
  @ViewChild('hospital_map') mapSvg: ElementRef;
  leaderImg={x:'0',y:'0'};


  constructor(private _userService: UserService, private renderer: Renderer2,private _chatService:ChatService,private router: Router,private route: ActivatedRoute,public dialog: MdDialog) {
    this.game = {
      teams:[],
      totalActions:0,
      timeSpend:'00:00'
    };

    this.timer= {minutes:"00",seconds:"00"};

  }

  ngOnInit() {



    this._chatService.getMessages().subscribe((message)=>{


      if(message['topic'] === "join-game"){

        console.log("Join Game");
        this.game = message['data'];


        if(this.game.isStarted){

          this.title= "Game was already started...";
        }

      }

      else if(message['topic'] ==="game-start"){
        this.title="Game Started!";

      }
      else if(message['topic']==="timer"){

        this.timer = message['data'];


      }
      else if(message['topic']==="game-over"){

      }

    });

    //reading route parameters
     this.route.params.subscribe(params=>{
      this._userService.getUserById(params['userId']).subscribe((user)=>{
        this.user = <IUser>user;

      });
      this.scenarioId = params['scenarioId'];

    });

    //TODO: show the map + leader/nurse on it with the leader/team name as it was shown on the paper prototype
    // show notification waiting for others to be log in
    // make the gamemap view as in the paper prototype for leader
    // make the gamemap view for nurses: visualize the map, users on the map, header is same as in leader gamemapview






  }


  ngAfterViewInit() {



  }


  /*GUI interactions*/
  mapClick(event){
    console.log(event);
    console.log(this);
  }

  updateMap(){

  }



}
