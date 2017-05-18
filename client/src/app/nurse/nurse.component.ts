/**
 * Created by asoadmin on 2017-05-05.
 */
import {
  Component,
  OnInit, ViewChild
} from '@angular/core';


import { UserService } from '../user.service';
import {AdminService} from '../admin.service';
import {IPatient, IScenario, IUser} from "../admin.interfaces";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MovePatientDialogComponent} from "../gamemap/gamemap.component";
import {MdDialog} from "@angular/material";

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss']

})
export class NurseComponent implements OnInit {

  user:IUser;
  room:string;
  patient:IPatient;

  treatmentsForm: FormGroup;



  constructor(
     private router: Router, private route: ActivatedRoute,private _userService:UserService,public _fb: FormBuilder,public dialog: MdDialog
  ) {

    this.treatmentsForm = this._fb.group({

        airway:this._fb.group({

        }),
        breathing:this._fb.group({

        }),
        circulation:this._fb.group({

        }),
        disability:this._fb.group({

        }),
        exposure:this._fb.group({

        })

    });

    this.user = _userService.getUser();


    this.route.params.subscribe(params => {
      this.room = params['room'];
      //this.patient = params['patientId'];
      console.log(params['patientId']);
    })


    //for testing
   // this.room = "Akut 1";

    this.patient = {
      scenarioId:"id",
      identificator:"Patient A",
      name: "Svea Larsen",
      age: 60,
      gender:"Male",
      triage:"YELLOW",//[RED,ORANGE,YELLOW,GREEN,BLACK]
      description: "Trampat snett i samband med att han klev ur sin traktor. Tidigare frisk, inga mediciner. Väntar på röntgenundersökning av höger fotled.", //list of injures
      airway:{
        type:"OK",
        description:"Fri luftväg"

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
      locations:["Akut1"],
      coordinates:{x:230,y:382},
      imgUrl:"../assets/YELLOW.png"
    };

  }

  ngOnInit() {
    let airwayTreatments: Array<any> =
      [
        { key: 'Intubation', value: 'Intubation' ,checked:false},//*

      ];

    let breathingTreatments: Array<any> =
      [

        { key: 'Assisted breathing', value: 'Assisted breathing' ,checked:false},//*
        { key: 'Oxygen', value: 'Oxygen' ,checked:false},//*
        { key: 'Pleuratappning', value: 'Pleuratappning',checked:false }//*
      ];

    let circulationTreatments: Array<any> =
      [

        { key: 'Blood sample', value: 'Blood sample',checked:false },//*
        { key: 'Iv fluid- warm', value: 'Iv fluid- warm' ,checked:false},//*
        { key: 'Pain relief', value: 'Pain relief' ,checked:false},//*
        { key: 'Pelvis support', value: 'Pelvis support' ,checked:false},//*
        { key: 'Bloodtransfer', value: 'Bloodtransfer',checked:false },//*

      ];

    let disabilityTreatments: Array<any> =
      [
        {key: 'Calming talk, someone close.', value: 'Calming talk, someone close.' ,checked:false},
      ];

    let exposureTreatments: Array<any> =
      [
        { key: 'Stabilized fracture with cast', value: 'Stabilized fracture with cast' ,checked:false},//*
        { key: 'Antibiotic', value: 'Antibiotic' ,checked:false},//*
        { key: 'Warm blankets', value: 'Warm blankets' ,checked:false},//*
        { key: 'Immobilization', value: 'Immobilization',checked:false },
        { key: 'Pain killers', value: 'Pain killers',checked:false },//*
        { key: 'Reponering and Immobilization foot- with cast', value: 'Reponering and Immobilization foot- with cast' ,checked:false},
        { key: 'Immobilization', value: 'Immobilization' ,checked:false}

      ];



    let treatmentsControlArray = new FormArray(airwayTreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));


    let airwayGroup = <FormGroup>this.treatmentsForm.get('airway');
    airwayGroup.addControl("alltreatments",treatmentsControlArray);
    airwayGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray.value),Validators.required));

    this.treatmentsForm.controls.airway.get('alltreatments').valueChanges.subscribe((v) => {
      console.log("here");
      this.treatmentsForm.controls.airway.get('selectedTreatments').setValue(this.mapTreatments(v));

    });


    let treatmentsControlArray2 = new FormArray(breathingTreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));


    let breathingGroup = <FormGroup>this.treatmentsForm.get('breathing');
    breathingGroup.addControl("alltreatments",treatmentsControlArray2);
    breathingGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray2.value),Validators.required));

    this.treatmentsForm.controls.breathing.get('alltreatments').valueChanges.subscribe((v) => {

      this.treatmentsForm.controls.breathing.get('selectedTreatments').setValue(this.mapTreatments(v));

    });


    let treatmentsControlArray3 = new FormArray(circulationTreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));

    let circulationGroup = <FormGroup>this.treatmentsForm.get('circulation');
    circulationGroup.addControl("alltreatments",treatmentsControlArray3);
    circulationGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray3.value),Validators.required))

    this.treatmentsForm.controls.circulation.get('alltreatments').valueChanges.subscribe((v) => {
      this.treatmentsForm.controls.circulation.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray4 = new FormArray(disabilityTreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));

    let disabilityGroup = <FormGroup>this.treatmentsForm.get('disability');
    disabilityGroup.addControl("alltreatments",treatmentsControlArray4);
    disabilityGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray4.value),Validators.required))

    this.treatmentsForm.controls.disability.get('alltreatments').valueChanges.subscribe((v) => {
      this.treatmentsForm.controls.disability.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray5 = new FormArray(exposureTreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));
    let exposureGroup = <FormGroup>this.treatmentsForm.get('exposure');
    exposureGroup.addControl("alltreatments",treatmentsControlArray5);
    exposureGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray5.value),Validators.required))

    this.treatmentsForm.controls.exposure.get('alltreatments').valueChanges.subscribe((v) => {
      this.treatmentsForm.controls.exposure.get('selectedTreatments').setValue(this.mapTreatments(v));

    });


  }

  mapTreatments(treatments){
    let selectedTreatments = treatments.filter((l) => l.checked).map((l) => l.key);
    return selectedTreatments.length ? selectedTreatments : null;
  }

  movePatient(){
    this.openMovePatientDialog()
  }

  onSubmit(event){
    console.log("get form data");
    console.log(this.treatmentsForm.value);
  }

  /**
   *
   * @param pIdentificator e.g., patient1,P1,patientA, etc.
   */
  openMovePatientDialog(){

    let dialogRef = this.dialog.open(MovePatientDialogComponent);
    dialogRef.componentInstance.identificator = this.patient.identificator;

    dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          //save results, add patient new location
          this.patient.locations.push(result);
          //show notify a leader dialog

          //after redirect to gamemap view


    });

  }

  back(){
    this.router.navigate(['/gamemap',this.patient.scenarioId]);
  }


}
