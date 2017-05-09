/**
 * Created by asoadmin on 2017-04-29.
 */
import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';

import { FormBuilder, Validators } from '@angular/forms';

import { IScenario } from '../admin.interfaces';
import {AdminService} from '../admin.service';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss']
})

export class ScenarioComponent implements OnInit{

  public scenario:IScenario;

  public scenarioForm = this.fb.group({
    name: ["", Validators.required],
    description: ["", Validators.required],
    duration: ["", Validators.required],
    metana_report:["", Validators.required],
    ashet_report:["",Validators.required],
    nPatients:["", Validators.required],
    maxReservedNurses:["", Validators.required],
    nBusyRooms:["", Validators.required],
    info_bakjour:["", Validators.required]
  });

  duration:string;

  durations = [
    {value: '15', viewValue: '15 min'},
    {value: '20', viewValue: '20 min'},
    {value: '25', viewValue: '25 min'}
  ];


  constructor(private _adminService: AdminService,public fb: FormBuilder, private router: Router){}

  ngOnInit() {

  }

  onSubmit(event){
   // console.log(this.scenarioForm.value);
    this._adminService.createScenario(this.scenarioForm.value).subscribe((newScenario: IScenario) => {
        //console.log(newScenario);
        this.router.navigate(['/patient',newScenario._id]);
    });


  }

}


