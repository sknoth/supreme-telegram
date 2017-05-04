/**
 * Created by asoadmin on 2017-05-01.
 */
/**
 * Created by asoadmin on 2017-05-01.
 */
/**
 * Created by asoadmin on 2017-04-29.
 */
import {Component, Input, Output,OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {FormArray, FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';

import {IScenario, IPatient, IAirway} from '../admin.interfaces';

import {AdminService} from '../admin.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

interface  TreatmentKeyValue {key:string;value:string;}

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']


})

export class PatientDetailComponent implements OnInit{



  @Input() title:string;
  @Input() identificator:string;
  @Input('group') public patientForm: FormGroup;



   treatments: TreatmentKeyValue[];

   gender:string;

   genders = [
    {value: 'Female', viewValue: 'Female'},
    {value: 'Male', viewValue: 'Male'}

  ];

  triage:string;
  triages = [
    {value: 'RED', viewValue: 'Red'},
    {value: 'ORANGE', viewValue: 'Orange'},
    {value: 'YELLOW', viewValue: 'Yellow'},
    {value: 'GREEN', viewValue: 'Green'},
    {value: 'BLACK', viewValue: 'Black'}

  ]

   type:string;


   airways = [
    'FREE',
    'THREAT',
    'BLOCKED'
  ];

   skinType:string;

   skinTypes=[
     'Cold',
     'Normal'
   ];
  mucusColor:string;
  mucusColors=[
    'Pale',
    'Normal'
  ]


   alltreatments: Array<any> =
    [
      { key: 'Chinlift', value: 'Chinlift' ,checked:false},
      { key: 'Intubation', value: 'Intubation' ,checked:false},
      { key: 'Assisted breathing', value: 'Assisted breathing' ,checked:false},
      { key: 'Blood sample', value: 'Blood sample',checked:false },
      { key: 'Stabilized fracture with cast', value: 'Stabilized fracture with cast' ,checked:false},
      { key: 'Antibiotic', value: 'Antibiotic' ,checked:false},
      { key: 'Warm blankets', value: 'Warm blankets' ,checked:false},
      { key: 'Immobilization', value: 'Immobilization',checked:false },
      { key: 'Oxygen', value: 'Oxygen' ,checked:false},
      { key: 'Iv fluid- warm', value: 'Iv fluid- warm' ,checked:false},
      { key: 'Pain killers', value: 'Pain killers',checked:false },
      { key: 'Calming talk, someone close.', value: 'Calming talk, someone close.' ,checked:false},
      { key: 'Pain relief', value: 'Pain relief' ,checked:false},
      { key: 'Pelvis support', value: 'Pelvis support' ,checked:false},
      { key: 'Bloodtransfer', value: 'Bloodtransfer',checked:false },
      { key: 'Reponering and Immobilization foot- with cast', value: 'Reponering and Immobilization foot- with cast' ,checked:false},
      { key: 'Immobilization', value: 'Immobilization' ,checked:false},
      { key: 'Pleuratappning', value: 'Pleuratappning',checked:false }

    ];



  constructor(private _adminService: AdminService,public fb: FormBuilder, private router: Router){}

  ngOnInit() {
    console.log("child init");
    console.log(this.identificator);


    let treatmentsControlArray = new FormArray(this.alltreatments.map((tr)=> {
         return new FormGroup({
           key: new FormControl(tr.key),
           value: new FormControl(tr.value),
           checked: new FormControl(false)
         });

    }));


    let airwayGroup = <FormGroup>this.patientForm.get('airway');
    airwayGroup.addControl("alltreatments",treatmentsControlArray);
    airwayGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray.value),Validators.required));

    this.patientForm.controls.airway.get('alltreatments').valueChanges.subscribe((v) => {
      console.log("here");
      this.patientForm.controls.airway.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray2 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));


    let breathingGroup = <FormGroup>this.patientForm.get('breathing');
    breathingGroup.addControl("alltreatments",treatmentsControlArray2);
    breathingGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray2.value),Validators.required));

    this.patientForm.controls.breathing.get('alltreatments').valueChanges.subscribe((v) => {
      console.log("here2");
      this.patientForm.controls.breathing.get('selectedTreatments').setValue(this.mapTreatments(v));

    });


    let treatmentsControlArray3 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));

    let circulationGroup = <FormGroup>this.patientForm.get('circulation');
    circulationGroup.addControl("alltreatments",treatmentsControlArray3);
    circulationGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray3.value),Validators.required))

    this.patientForm.controls.circulation.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.circulation.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray4 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));

    let disabilityGroup = <FormGroup>this.patientForm.get('disability');
    disabilityGroup.addControl("alltreatments",treatmentsControlArray4);
    disabilityGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray4.value),Validators.required))

    this.patientForm.controls.disability.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.disability.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray5 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));
    let exposureGroup = <FormGroup>this.patientForm.get('exposure');
    exposureGroup.addControl("alltreatments",treatmentsControlArray5);
    exposureGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray5.value),Validators.required))

    this.patientForm.controls.exposure.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.exposure.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

  }

   mapTreatments(treatments){
     let selectedTreatments = treatments.filter((l) => l.checked).map((l) => l.key);
     return selectedTreatments.length ? selectedTreatments : null;
   }


  updateChild(id,newForm){

    this.identificator = id;
    this.patientForm = newForm;
    console.log(id);
    console.log(this.patientForm);


    let treatmentsControlArray = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));


    let airwayGroup = <FormGroup>this.patientForm.get('airway');
    airwayGroup.addControl("alltreatments",treatmentsControlArray);
    airwayGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray.value),Validators.required))

    this.patientForm.controls.airway.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.airway.get('selectedTreatments').setValue(this.mapTreatments(v));

    });


    let treatmentsControlArray2 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));


    let breathingGroup = <FormGroup>this.patientForm.get('breathing');
    breathingGroup.addControl("alltreatments",treatmentsControlArray2);
    breathingGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray2.value),Validators.required));

    this.patientForm.controls.breathing.get('alltreatments').valueChanges.subscribe((v) => {
      console.log("here2");
      this.patientForm.controls.breathing.get('selectedTreatments').setValue(this.mapTreatments(v));

    });


    let treatmentsControlArray3 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));

    let circulationGroup = <FormGroup>this.patientForm.get('circulation');
    circulationGroup.addControl("alltreatments",treatmentsControlArray3);
    circulationGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray3.value),Validators.required))

    this.patientForm.controls.circulation.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.circulation.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray4 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));

    let disabilityGroup = <FormGroup>this.patientForm.get('disability');
    disabilityGroup.addControl("alltreatments",treatmentsControlArray4);
    disabilityGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray4.value),Validators.required))

    this.patientForm.controls.disability.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.disability.get('selectedTreatments').setValue(this.mapTreatments(v));

    });

    let treatmentsControlArray5 = new FormArray(this.alltreatments.map((tr)=> {
      return new FormGroup({
        key: new FormControl(tr.key),
        value: new FormControl(tr.value),
        checked: new FormControl(false)
      });

    }));
    let exposureGroup = <FormGroup>this.patientForm.get('exposure');
    exposureGroup.addControl("alltreatments",treatmentsControlArray5);
    exposureGroup.addControl("selectedTreatments", new FormControl(this.mapTreatments(treatmentsControlArray5.value),Validators.required))

    this.patientForm.controls.exposure.get('alltreatments').valueChanges.subscribe((v) => {
      this.patientForm.controls.exposure.get('selectedTreatments').setValue(this.mapTreatments(v));

    });



  }




}


