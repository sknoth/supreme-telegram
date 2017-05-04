/**
 * Created by asoadmin on 2017-05-01.
 */
/**
 * Created by asoadmin on 2017-04-29.
 */
import {Component, Input, Output,OnInit,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { IScenario,IPatient} from '../admin.interfaces';

import {AdminService} from '../admin.service';

import {PatientDetailComponent} from './patient-detail.component';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})

export class PatientComponent implements OnInit{


  private scenario:IScenario;

  public nView:number;
  public isAllPatient:boolean;

  @ViewChild(PatientDetailComponent)
  private patientDetailComponent: PatientDetailComponent;

  //patient identificator
  public identificator:string;
  public title:string;

  identificators:any[];

  public patientForm: FormGroup;
  public allPatientsForm:FormGroup;


  constructor(private _adminService: AdminService,public _fb: FormBuilder, private router: Router,private route: ActivatedRoute){
    this.identificators = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
  }

  ngOnInit() {
     console.log("init parent");
     this.isAllPatient = false;
     this.route.params
    // (+) converts string 'id' to a number
       .switchMap((params: Params) => this._adminService.getScenario(params['id']))
      .subscribe((scenario: IScenario) => this.scenario = scenario);


     this.nView = 0;
     this.title = 'Patient ' + this.identificators[this.nView];
     this.identificator = "patient" + this.identificators[this.nView];


     this.allPatientsForm = this._fb.group({
      patientA: this.initPatient()

     });


     this.patientForm = <FormGroup>this.allPatientsForm.get("patient" + this.identificators[this.nView]);
  }

  initPatient(){
    return this._fb.group({
      name: ['', Validators.required],
      age: ['',Validators.required],
      identificator:['',Validators.required],
      gender:['',Validators.required],
      triage:['',Validators.required],
      injures:['',Validators.required],
      airway:this.initAirway(),
      breathing:this.initBreathing(),
      circulation:this.initCirculation(),
      disability:this.initDisability(),
      exposure:this.initExposure()


    });
  }

  initAirway() {
    return this._fb.group({
      type: [''],
      description: ['']

    });
  }

  initBreathing(){
    return this._fb.group({
      af: [''],
      spo2: [''],
      bfrequency: [''],
      description: ['']
    });
  }

  initCirculation(){
    return this._fb.group({
      bt: [''],
      pulse: [''],
      skinType: [''],
      mucusColor: [''],
      capillary: [''],
      description: ['']
    });
  }

  initDisability(){
    return this._fb.group({
      rls: [''],
      gcs: [''],
      glucose: [''],
      description: ['']
    });
  }

  initExposure(){
    return this._fb.group({
      temperature: [''],
      description: ['']

    });
  }

  onSubmit(event){
    console.log(this.scenario);

    delete this.patientForm.value.airway['alltreatments'];
    delete this.patientForm.value.breathing['alltreatments'];
    delete this.patientForm.value.circulation['alltreatments'];
    delete this.patientForm.value.disability['alltreatments'];
    delete this.patientForm.value.exposure['alltreatments'];



    this.patientForm.value.scenarioId = this.scenario._id;
    this.patientForm.value.identificator = this.identificator;


    console.log(this.patientForm.value);

    this.nView++;

    if(this.nView === this.scenario.nPatients-1){
      this.isAllPatient = true;
    }

    if(this.nView<this.scenario.nPatients){

      //send patient to server
      this._adminService.createPatient(<IPatient>this.patientForm.value).subscribe((data) => {
        console.log(data);
      });


      this.identificator = "patient" + this.identificators[this.nView];
      this.title = "Patient " + this.identificators[this.nView];

      //create a new patient form

      this.allPatientsForm.addControl(this.identificator,this.initPatient());

      //update child view
      this.patientDetailComponent.updateChild("patient" + this.identificators[this.nView],<FormGroup>this.allPatientsForm.get("patient" + this.identificators[this.nView]));



    }
    else{

      //navigate back to list of scenarios
      this.router.navigate(['/admin']);
    }


  }

}


