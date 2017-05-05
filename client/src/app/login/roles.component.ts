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
import {ChatService} from '../chat.service';

import {IUser} from "../admin.interfaces";
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

  leader_disabled = false;

  user:IUser;

  constructor(
    @Inject(FormBuilder) _formBuilder : FormBuilder,
    private _userService: UserService, private _chatService:ChatService,private router: Router,private route: ActivatedRoute,public dialog: MdDialog
  ) {


  }

  ngOnInit() {
    //reading route parameters
    this.route.params.subscribe(params=>{
      this.name = params['name'];
      this.surname = params['surname'];
      this.scenarioId = params['scenario'];

    })


    this._chatService.connect();

    this._chatService.getMessages().subscribe(message=>{
       console.log(message);

      if(message['topic'] === "disable-leader"){

        this.leader_disabled = true; //TODO:disabel leader button, this code does not work, do not know why?

      }

    });
  }

  /**
   * Set users role
   * @param role - is string
   */
  setRole(role) {
     //console.log(role);
     this.role = role;


     if(this.role === "NURSE"){
       this.openDialog();
     }
     else{
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
      role:this.role

    }

    //create user
    this._userService.addUser(user).subscribe((v)=>{

      console.log(v);
      //notify all
      this._chatService.sendMessage("login",JSON.stringify({user:v,scenarioId:this.scenarioId,doctor:this.doctor}));
      //show gamemap view
      this.router.navigate(['/gamemap',v._id,this.scenarioId]);
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
