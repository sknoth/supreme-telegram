import {Component, OnInit, ElementRef, AfterViewInit, Renderer2, ViewChild} from '@angular/core';

import { UserService } from '../user.service';
import {ChatService} from '../chat.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MdDialog, MdDialogRef, MdSidenav} from "@angular/material";
import {IGame, IPatient, IUser} from "../admin.interfaces";

import { GameStore } from '../state/game.store';

import { LocalStorageService } from 'angular-2-local-storage';

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
  hideActionButton = true;



  // Sidemenu 9 buttons
  @ViewChild('sidenav') sidenav: MdSidenav;

  contacted = {};

  //patients that are located in the hospital before the accident happened
  patientsAtED:IPatient[];

  //location map
  locationMap = {
    "ED":{x:259,y:83},
    "Akut1":{x:255,y:129},
    "Akut2":{x:305,y:129},
    "Room10":{x:350,y:129},
    "Room11":{x:100,y:129},
    "Room12":{x:76,y:129},
    "Room13":{x:45,y:129},
    "Room14":{x:310,y:200},
    "Room15":{x:253,y:200},
    "Room16":{x:110,y:200},
    "Room17":{x:300,y:250},
    "Room18":{x:253,y:250}


  }




  constructor(
    private _userService: UserService,
    private renderer: Renderer2,
    private _chatService:ChatService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog,
    private _gameStore: GameStore,
    private localStorageService:LocalStorageService) {



      this.timer = { minutes:"00", seconds:"00"};
      localStorageService.clearAll();

      if(!localStorageService.get("patientsED")){

        localStorageService.set("patientsED",this.patientsAtED);
      }
      else{
        this.patientsAtED = localStorageService.get("patientsED") as [IPatient];
      }

      this.initPatientAtED();

      if(!localStorageService.get("user")) {
        localStorageService.set("user",_userService.getUser());
        this.user = _userService.getUser();
      }
      else{
        this.user = localStorageService.get("user") as IUser;
      }

      if(localStorageService.get("game")){
        this.game = localStorageService.get("game") as IGame;
      }





  }

  ngOnInit() {


    this._chatService.getMessages().subscribe((message) => {

      if(message['topic'] === "join-game") {

        console.log("Join Game");

        this.game = message['data'];
        if(!this.localStorageService.get("game")) {
          this.localStorageService.set("game",message['data']);

        }
        //this.startPatientToArrive();
        //console.log(message['data']);



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
        //console.log('timer', message);

        this.timer = message['data'];

      } else if (message['topic']==="game-over") {

        this.openNotificationDialog("Game Over", "The game is over", 'gameover');

      } else if (message['topic']==="left-game") {

        console.log("user is offline!");
        console.log(message['data']);

        this.openNotificationDialog("Left Game",message['data'] + "has left the game!");

      } else if (message['topic'] ==="update-game") {
        console.log("game was updated!");
        console.log(message['data']);
        this.game = message['data'];
        console.log(this.game);
      }
      else if(message['topic']==="action-card"){
          console.log("here!");
          console.log(message['data']);
          if(this.user._id === message['data'].user._id){
            this.user = message['data'].user;
            //show action card dialog
            this.openNotificationDialog("Action Card", "Your team is " + message['data'].content.name);

          }
      }
      else if(message['topic']==="receive-patient"){
          console.log(message['data']);
          if(this.user._id === message['data'].userId){
            this.router.navigate(['/nurse', message['data'].room, message['data'].patient._id]);
          }
      }
      else if (message['topic']==="move-ed-patient"){
          console.log("move-ed-patient");
          console.log(message['data']);

          var oldPatient = this.patientsAtED.filter(patient=>patient.identificator===message['data'].identificator)[0];
          //oldPatient = message['data'];
          console.log(this.patientsAtED.indexOf(oldPatient));
          var index = this.patientsAtED.indexOf(oldPatient);
          this.patientsAtED[index] = message['data'];


      }

    });


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
    this._userService.updateUser(this.user);
    this.title ="Inform all personal about the accident.";
    this.hideDebrifButton = true;
  }

  contactUnit(unit, e?) {
    console.log('contactUnit', unit, e);
    this.contacted[unit] = true;
    var action_message = "Kontakta " + unit;
    this.user.actions.push({name:action_message,time:new Date()});

    //console.log(this.user);
    this._userService.updateUser(this.user);

    //disable the button

    //if LAS called
    if(unit === "LAS"){
      //show input dialog;
      this.openInputDialog("Request Number of Beds","Number of Beds","las");
    }
    else if(unit ==="Bakjour"){
      this.openNotificationDialog("Bakjour Response","Förstärkningsläge")
    }

    if(Object.keys(this.contacted).length===9){
      //hide all 9 buttons
      this.sidenav.close();
      this.hideCallButton = true;
      this.title = "Send Actions Cards to the teams";
      this.hideActionButton = false;




    }
  }

  sendActionsCardsDialog(){

    this.openSendActionCardDialog("Destribute the Actions Cards to the Users");
  }


  startPatientToArrive(){
     //calculate the max time between the patients
     var maxTime = (this.game.scenario.duration/this.game.scenario.nPatients)*60000; //in miliseonds
     var minTime = 10000; //1 minute;
     var arrivalTime = 1000;//3 seconds for first patient to be arrived at the ED
     var counter = 0;
     var locationMap = this.locationMap;
     var game = this.game;
     var chatService = this._chatService;
     //check setInterval!!!
     console.log( this.game.scenario.patients);

    //  game.scenario.patients[counter].visibility = "visible";
    //  game.scenario.patients[counter].locations.push("ED");
    //  game.scenario.patients[counter].coordinates = locationMap.ED;
    //  if(game.scenario.patients[counter].triage==="RED"){
    //    game.scenario.patients[counter].imgUrl = "assets/red_patient.png";
    //  }
    //  else if(game.scenario.patients[counter].triage==="ORANGE"){
    //    game.scenario.patients[counter].imgUrl = "assets/orange_patient.png";
    //  }
    //  else if(game.scenario.patients[counter].triage==="YELLOW"){
    //    game.scenario.patients[counter].imgUrl = "assets/yellow_patient.png";
    //  }
    //  else if(game.scenario.patients[counter].triage==="GREEN"){
    //    game.scenario.patients[counter].imgUrl = "assets/green_patient.png";
    //  }
    // chatService.sendMessage("update-patient",{gameId: game._id,patient: game.scenario.patients[counter]});

    console.log( this.game.scenario.patients);

     var nextPatient = function () {
       clearInterval(patientTimer);
       game.scenario.patients[counter].visibility = "visible";
       game.scenario.patients[counter].locations.push("ED");
       game.scenario.patients[counter].coordinates = locationMap.ED;
       if(game.scenario.patients[counter].triage==="RED"){
          game.scenario.patients[counter].imgUrl = "assets/red_patient.png";
       }
      else if(game.scenario.patients[counter].triage==="ORANGE"){
      game.scenario.patients[counter].imgUrl = "assets/orange_patient.png";
      }
      else if(game.scenario.patients[counter].triage==="YELLOW"){
      game.scenario.patients[counter].imgUrl = "assets/yellow_patient.png";
      }
      else if(game.scenario.patients[counter].triage==="GREEN"){
      game.scenario.patients[counter].imgUrl = "assets/green_patient.png";
      }
       console.log( game.scenario.patients[counter].identificator);

       //update patient
       chatService.sendMessage("update-patient",{gameId: game._id,patient: game.scenario.patients[counter]});


       //var arrivalTime = Math.floor(Math.random()*(maxTime-minTime+1)+minTime);
       var arrivalTime = 20000;

       console.log(arrivalTime);
       counter++;

       if(counter===game.scenario.patients.length){
         console.log("stop patient arriving");
         clearInterval(patientTimer);
       }
       else{
         patientTimer = setInterval(nextPatient,arrivalTime);
       }

     };

     var patientTimer = setInterval(nextPatient,arrivalTime);


  }


  patientClick(event,patientIdentificator){
    console.log(patientIdentificator);

    if(this.user.role === "LEADER"){
      //show move patient dialog
      var selectedPatient = this.game.scenario.patients.filter(item => item.identificator ===patientIdentificator)[0];
      this.openAssignedPatientIdDialog(selectedPatient);

    }
  }

  /**DIALOGS**/

  openSendActionCardDialog(title,result?,icon?,styleCSS?){


    let dialogRef = this.dialog.open(SendActionCardDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.game = this.game;

    dialogRef.afterClosed().subscribe(result => {
      if(result ==="send"){
        console.log('dialogRef.afterClosed()', dialogRef.componentInstance.card1);

        //update the teams in the game
        if(dialogRef.componentInstance.card5){
          console.log(dialogRef.componentInstance.card5);
          this._chatService.sendMessage("action-card",{gameId:this.game._id,userId:dialogRef.componentInstance.card5,content:{name:"Team1",doctor:this.user.team.doctor}});

        }
        if(dialogRef.componentInstance.card6){
          console.log(dialogRef.componentInstance.card6);
          this._chatService.sendMessage("action-card",{gameId:this.game._id,userId:dialogRef.componentInstance.card6,content:{name:"Team2",doctor:this.user.team.doctor}});

        }
        if(dialogRef.componentInstance.card7){
          console.log(dialogRef.componentInstance.card7);
          this._chatService.sendMessage("action-card",{gameId:this.game._id,userId:dialogRef.componentInstance.card7,content:{name:"Team3",doctor:this.user.team.doctor}});

        }





        this.user.actions.push({name:"Sent actions cards",time:new Date()});
        //hide button
        this.hideActionButton = true;
        //move leader to the entrance hall for waiting of patients

        this.user.location = {x:160,y:120};
        this._chatService.sendMessage("user-moved",{userId:this.user._id,location:this.user.location});
        //ready to receive the patient
        this.startPatientToArrive();

      }
      else{
        console.log("cancel the action cards");
      }


    });

  }



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

        //update the user action
        this._userService.updateUser(this.user).subscribe(result=>{

        });

      } else if (result === "ashet") {
        this.user.actions.push({name:"ashet", time:new Date()});

        this.title = "Inform the rest.....";
        this.hideDebrifButton = true;

        //show all 9 buttons
        this.hideCallButton = false;
        this._userService.updateUser(this.user).subscribe(result=>{

        });;


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

      console.log(result);

      if(result ==="las"){
        //TODO:get input value from dialog!
        console.log("Las has been contacted! " + dialogRef.componentInstance.input);
        this.user.actions.push({name:"Requested "+dialogRef.componentInstance.input+" number of Beds",time:new Date()});
        this._userService.updateUser(this.user).subscribe(result=>{

        });

      }


    });


  }

  openAssignedPatientIdDialog(patient) {

    let dialogRef = this.dialog.open(AssignedPatientDialog);
    dialogRef.componentInstance.patient = patient;
    dialogRef.componentInstance.game = this.game;
    dialogRef.componentInstance.rooms = Object.keys(this.locationMap);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result === "ok"){
         console.log("ok");
         console.log(dialogRef.componentInstance.team + " takes "  + dialogRef.componentInstance.room);
         //move patient to the room
         patient.coordinates = this.locationMap[dialogRef.componentInstance.room];
         //move team to the room
         var teamLocation = {x:patient.coordinates.x,y:patient.coordinates.y+30};

         this._chatService.sendMessage("user-moved",{userId:dialogRef.componentInstance.team,location:teamLocation});

         //notify the team
        this._chatService.sendMessage("patient-assigned",{gameId: this.game._id,patient: patient,room:dialogRef.componentInstance.room,userId:dialogRef.componentInstance.team});

         //update the patient and team location
        patient.locations.push(dialogRef.componentInstance.room);

        this._chatService.sendMessage("update-patient",{gameId: this.game._id,patient: patient});


      }
      else if(result === "cancel"){
        console.log("cancel");
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
          if(this.user.role ==="LEADER"){

          }
          else{
            this.openMovePatientDialog(patient.identificator);
          }

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

      if(result ==="corridor"){
        var patient = this.patientsAtED.filter(patient=>patient.identificator===pIdentificator)[0];
        patient.coordinates = {x:170,y:300};
        patient.locations.push("Corridor");

        this._chatService.sendMessage("update-ed-patient",{gameId: this.game._id,patient: patient});

      }


      if(result != "corridor" && result != "waitED"){
        var patient = this.patientsAtED.filter(patient=>patient.identificator===pIdentificator)[0];
        patient.locations.push(result);
        patient.visibility = "hidden";

        this._chatService.sendMessage("update-ed-patient",{gameId: this.game._id,patient: patient});
      }

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
      imgUrl:"../assets/YELLOW.png",
      visibility:"visible"
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
      imgUrl:"../assets/GREEN.png",
      visibility:"visible"
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
      imgUrl:"../assets/YELLOW.png",
      visibility:"visible"
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
      imgUrl:"../assets/YELLOW.png",
      visibility:"visible"
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
      imgUrl:"../assets/ORANGE.png",
      visibility:"visible"
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
  input:string; //the input that user provided
  result:string;//the return value from button Send
  styleCSS:string; //class name


  constructor(public dialogRef: MdDialogRef<InputDialogComponent>) {}
}


@Component({
  selector: 'app-action-card-dialog',
  templateUrl: './send-action-card-dialog.component.html'

})
export class SendActionCardDialogComponent {
  title:string;
  game:IGame;
  value=""; //the input that user provided
  result:string;//the return value from button Send
  styleCSS:string; //class name;
  card1:string; //userId
  card2:string; //userId
  card3:string; //userId
  card4:string; //userId
  card5:string; //userId
  card6:string; //userId
  card7:string; //userId



  constructor(public dialogRef: MdDialogRef<SendActionCardDialogComponent>) {}
}


@Component({
  selector: 'app-assigned-patient-dialog',
  templateUrl: './assignedPatientDialog.component.html'

})
export class AssignedPatientDialog {
  game:IGame;
  room:string; //the input that user provided
  team:string;//the return value from button Send
  patient:IPatient;
  rooms:Object;

  constructor(public dialogRef: MdDialogRef<AssignedPatientDialog>) {}
}
