import {Component, OnInit, ElementRef, AfterViewInit, Renderer2, ViewChild} from '@angular/core';

import { UserService } from '../user.service';
import {ChatService} from '../chat.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MdDialog, MdDialogRef} from "@angular/material";
import {IGame, IPatient, IUser} from "../admin.interfaces";

import { GameStore } from '../state/game.store';

@Component({
  selector: 'app-gamemap',
  templateUrl: './gamemap.component.html',
  styleUrls: ['./gamemap.component.scss']

})
export class GamemapComponent implements OnInit,AfterViewInit {

  user:IUser; //current user
  // scenarioId:string;
  game:IGame;

  timer:{minutes:string,seconds:string};

  title = "Waiting for other users to be logged in......";
  //in milliseonds
  timeToshowASHET = 30000;//in 30 seconds

  //UI
  hideDebrifButton = true;
  hideCallButton = true;

  contacted = {};

  //patients that are located in the hospital before the accident happened
  patientsAtED:IPatient[];


  constructor(
    private _userService: UserService,
    private renderer: Renderer2,
    private _chatService:ChatService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog,
    private _gameStore: GameStore) {

      this._gameStore.game.subscribe((game) => {
        this.game = game;
      });

      this.timer = { minutes:"00", seconds:"00"};

      this.initPatientAtED();

      this.user = _userService.getUser()

  }

  ngOnInit() {

    this._chatService.getMessages().subscribe((message) => {

      if(message['topic'] === "join-game") {

        console.log("Join Game", this.game._id);

        if (this.game.isStarted) {
          this.title = "Game was already started...";
        }
      }

      else if(message['topic'] === "game-start") {

        this.title = "Game Started!";

        if (this.user.role === "LEADER") {
          console.log(this.game.scenario);

          //send notification to the leader about accident
          this.openNotificationDialog(
            "Incoming Call from Ambulance",
            this.game.scenario.description + "<p>" +this.game.scenario.metana_report +"</p>",
            "methane",
            "../assets/ambulance_call_icon.png",""
          );

          //after 30 seconds show ASHET report
          let dialogContent = this.game.scenario.ashet_report;
          let that = this;

          //show ashet report in 30seconds ->should be changed
          setTimeout(function () {
            that.openNotificationDialog(
              "Incoming Call with ASHET report",
              dialogContent,
              "ashet",
              "../assets/ambulance_call_icon.png",""
            );

          }, this.timeToshowASHET);

        } else {
          //send notification to the nurses "wait for the leader to be contacted"
          this.title = "Wait to be contacted by the Leader....";
        }

      } else if (message['topic'] === "timer") {
console.log('timer', message);

        this.timer = message['data'];

      } else if (message['topic']==="game-over") {

        this.openNotificationDialog("Game Over", "The game is over", 'gameover');

      } else if (message['topic']==="left-game") {

        console.log("user is offline!");
        console.log(message['data']);

        this.openNotificationDialog("Left Game",message['data'] + "has left the game!");

      } else if (message['topic'] ==="update-game") {
        console.log("game was updated!");
        this.game = message['data'];
      }

    });

    // make the gamemap view as in the paper prototype for leader
    // make the gamemap view for nurses: visualize the map, users on the map, header is same as in leader gamemapview

  }


  ngAfterViewInit() {

  }

  logOut() {
    this._chatService.disconnect({user:this.user,gameId:this.game._id});

    //redirect to login page
    this.router.navigate(['/login']);

  }


  /*GUI interactions*/
  mapClick(event){
    console.log(event);
    console.log(this);
  }

  patientEdClick(event,pIdentificator){
    console.log("patient click");
    console.log(pIdentificator);
    //show patient info dialog
    var selectedPatient = this.patientsAtED.filter(item => item.identificator ===pIdentificator)[0];
    this.openPatientIdDialog(selectedPatient);

  }

  /***USER ACTIONS****/

  debriefAction() {
    this.user.actions.push({name:"Debriefing",time:new Date()});
    this.title ="Inform all personal about the accident.";
    this.hideDebrifButton = true;
  }

  contactUnit(unit, e?) {
    console.log('contactUnit', unit, e);
    this.contacted[unit] = true;
    this.user.actions.push({name:"Kontakta " + unit,time:new Date()});
    //disable the button

    //if LAS called
    if(unit === "LAS"){
      //show input dialog;
      this.openInputDialog("Request Number of Beds","Number of Beds","las");
    }
  }

  /**DIALOGS**/

  openNotificationDialog(title,content,result?,icon?,styleCSS?){

    let dialogRef = this.dialog.open(NotificationDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.content = content;
    dialogRef.componentInstance.icon = icon;
    dialogRef.componentInstance.styleCSS = styleCSS;
    dialogRef.componentInstance.result = result;

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef.afterClosed()', result, this.user);

      if (result === "methane") {
        this.user.actions.push({name:"methane", time:new Date()});
        //show button Debriefing
        this.title = "Use button Debriefing to start to notify all personal about the accident";
        this.hideDebrifButton = false;

      } else if (result === "ashet") {
        this.user.actions.push({name:"ashet", time:new Date()});

        this.title = "Inform the rest.....";
        this.hideDebrifButton = true;

        //show all 9 buttons
        this.hideCallButton = false;

      } else if (result === "gameover") {
        this.router.navigate(['/score']);
      }
    });

  };

  openInputDialog(title,placeholder,result?,styleCss?){
    let dialogRef = this.dialog.open(InputDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.placeholder = placeholder;
    dialogRef.componentInstance.styleCSS = styleCss;
    dialogRef.componentInstance.result = result;

    dialogRef.afterClosed().subscribe(result => {
      //TODO:get input value from dialog!
      console.log(result);

      if(result ==="las"){
        console.log("Las has been contacted!");
        this.user.actions.push({name:"Requested X number of Beds",time:new Date()});

      }
    });


  }



  openPatientIdDialog(patient) {

    let dialogRef = this.dialog.open(PatientDialogComponent);
    dialogRef.componentInstance.imgUrl = patient.imgUrl;
    dialogRef.componentInstance.name = patient.name;
    dialogRef.componentInstance.age = patient.age;
    dialogRef.componentInstance.description = patient.description;


    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result === "move"){
          this.openMovePatientDialog(patient.identificator);
        }
        else if(result === "abcde"){
          this.openPatientInfoDialog(patient);
        }

    });
  }

  /**
   *
   * @param pIdentificator e.g., patient1,P1,patientA, etc.
   */
  openMovePatientDialog(pIdentificator) {

    let dialogRef = this.dialog.open(MovePatientDialogComponent);
    dialogRef.componentInstance.identificator = pIdentificator;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result, pIdentificator, this.game);
      this.user.actions.push({name:"Moved Patient to " + result, time:new Date()});
    });

  }

  openPatientInfoDialog(patient) {
    console.log(patient);

    let dialogRef = this.dialog.open(PatientInfoDialogComponent);
    dialogRef.componentInstance.patient = patient;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result === "move"){
        this.openMovePatientDialog(patient.identificator);
      }

    });
  }

  /*****Patients at ED*******/
  initPatientAtED() {
    //hard code patients at ED before the accident
    var patient1 = {
      identificator:"P1",
      name: "Svea Larsen",
      age: 60,
      gender:"Male",
      triage:"YELLOW",//[RED,ORANGE,YELLOW,GREEN,BLACK]
      description: "Trampat snett i samband med att han klev ur sin traktor. Tidigare frisk, inga mediciner. Väntar på röntgenundersökning av höger fotled.", //list of injures
      airway:{
        type:"OK",
        description:"Fri luftväg",
        selectedTreatments:[]
      },
      breathing:{
        af: 18,
        spo2: 96

      },
      circulation:{
        bt: "140/80",
        pulse: 80

      },
      disability:{
        rls: "RLS1",
        gcs: 15

      },
      exposure:{
        description: "höger fotled svullen, kan ej stödja på foten"
      },

      /**Updated fields**/
      locations:["Room21"],
      coordinates:{x:230,y:382},
      imgUrl:"../assets/YELLOW.png"
    };


    var patient2 = {
      identificator:"P2",
      name: "Robin Hapamäki",
      age: 35,
      gender:"Male",
      triage:"GREEN",//[RED,ORANGE,YELLOW,GREEN,BLACK]
      description: "Kommer via remiss från vårdcentral med frågeställning appendencit", //list of injures
      airway:{
        type:"OK",
        description:"Fri luftväg",
        selectedTreatments:[]
      },
      breathing:{
        af: 20,
        spo2: 99

      },
      circulation:{
        bt: "135/60",
        pulse: 75

      },
      disability:{
        rls: "RLS1",
        gcs: 15

      },
      exposure:{
        temperature:38,
        description: "Smärta höger fossa, normala tarmljud och mjuk buk vid palpation. Är smärtlindrad. Väntar på provsvar"
      },
      /**Updated fields**/
      locations:["Room12"],
      coordinates:{x:76,y:113},
      imgUrl:"../assets/GREEN.png"
    }


    var patient3 = {
      identificator:"P3",
      name: "Jorge Adamo",
      age: 85,
      gender:"Male",
      triage:"YELLOW",//[RED,ORANGE,YELLOW,GREEN,BLACK]
      description: "Har tilltagande andningsbesvär sedan några dagar, nu har han svårt att ligga ned och sova. Tidigare sjukdomar: Hjärtsvikt, Angina", //list of injures
      airway:{
        type:"OK",
        description:"Fri luftväg",
        selectedTreatments:[]
      },
      breathing:{
        af: 26,
        spo2: 95,
        description:"med syrgas"

      },
      circulation:{
        bt: "145/85",
        pulse: 90

      },
      disability:{
        rls: "RLS1",
        gcs: 15

      },

      /**Updated fields**/
      locations:["Room19"],
      coordinates:{x:299,y:382},
      imgUrl:"../assets/YELLOW.png"
    }


    var patient4 = {
      identificator:"P4",
      name: "Louise Larsson",
      age: 25,
      gender:"Female",
      triage:"YELLOW",//[RED,ORANGE,YELLOW,GREEN,BLACK]
      description: "Smärta höger axel efter hockeytackling, Tidigare sjukdomar: hypotyreos. Har varit på röntgen och väntar på röntgen svar", //list of injures
      airway:{
        type:"OK",
        description:"Fri luftväg",
        selectedTreatments:[]
      },
      breathing:{
        af: 18,
        spo2: 92

      },
      circulation:{
        bt: "120/60",
        pulse: 60

      },
      disability:{
        rls: "RLS1",
        gcs: 15

      },

      /**Updated fields**/
      locations:["Room15"],
      coordinates:{x:253,y:210},
      imgUrl:"../assets/YELLOW.png"
    };


    var patient5 = {
      identificator:"P5",
      name: "Boris Björgen",
      age: 65,
      gender:"Male",
      triage:"ORANGE",//[RED,ORANGE,YELLOW,GREEN,BLACK]
      description: "Pågående bröstsmärta, Tidigare sjukdomar: Angina, Hypertoni. Normalt EKG, väntar på läkarbedömning och provsvar", //list of injures
      airway:{
        type:"OK",
        description:"Fri luftväg",
        selectedTreatments:[]
      },
      breathing:{
        af: 22,
        spo2: 95

      },
      circulation:{
        bt: "145/85",
        pulse: 90

      },
      disability:{
        rls: "RLS1",
        gcs: 15

      },
      exposure:{
        temperature:36

      },
      /**Updated fields**/
      locations:["Room18"],
      coordinates:{x:253,y:235},
      imgUrl:"../assets/ORANGE.png"
    };
    this.patientsAtED = [];
    this.patientsAtED.push(<IPatient>patient1);
    this.patientsAtED.push(<IPatient>patient2);
    this.patientsAtED.push(<IPatient>patient3);
    this.patientsAtED.push(<IPatient>patient4);
    this.patientsAtED.push(<IPatient>patient5);
  }

}

/*******DIALOG COMPONENTS************/

@Component({
  selector: 'app-patientEd-dialog',
  templateUrl: './patient-overview-dialog.component.html',
})

export class PatientDialogComponent {
  name:string;
  age:number;
  description:string;
  imgUrl:string;

  constructor(public dialogRef: MdDialogRef<PatientDialogComponent>) {}
}


@Component({
  selector: 'app-move-patient-dialog',
  templateUrl: './move-patient-dialog.component.html',
})

export class MovePatientDialogComponent {
  identificator:string; //patient identificator

  constructor(public dialogRef: MdDialogRef<MovePatientDialogComponent>) {}
}



@Component({
  selector: 'app-patient-info-dialog',
  templateUrl: './patient-info-dialog.component.html',
  styleUrls: ['./patient-info-dialog.component.scss'],
})

export class PatientInfoDialogComponent {
  patient:IPatient;

  constructor(public dialogRef: MdDialogRef<PatientInfoDialogComponent>) {}
}

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html'

})

export class NotificationDialogComponent {
  title:string;
  icon:string;
  result:string; //the return value from the button "OK"
  content:string; //html content
  styleCSS:string; //class name


  constructor(public dialogRef: MdDialogRef<NotificationDialogComponent>) {}
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html'

})
export class InputDialogComponent {
  title:string;
  placeholder:string;
  value=""; //the input that user provided
  result:string;//the return value from button Send
  styleCSS:string; //class name


  constructor(public dialogRef: MdDialogRef<InputDialogComponent>) {}
}
