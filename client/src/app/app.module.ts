import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdDataTableModule } from 'ng2-md-datatable';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  GamemapComponent, InputDialogComponent, MovePatientDialogComponent, NotificationDialogComponent,
  PatientDialogComponent,
  PatientInfoDialogComponent
} from './gamemap/gamemap.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import {ScenarioComponent} from './admin/scenario.component';
import {PatientComponent} from './admin/patient.component';
import {PatientDetailComponent} from './admin/patient-detail.component';
import { ChatComponent } from './chat/chat.component';
import {RolesComponent} from './login/roles.component';
import {DoctorDialogComponent} from './login/roles.component';


import { UserService } from './user.service';
import {AdminService} from "./admin.service";


//Material components used in this application
import { MaterialModule } from '@angular/material';
import {ChatService} from "./chat.service";


@NgModule({
  declarations: [
    AppComponent,
    GamemapComponent,
    LoginComponent,
    AdminComponent,
    ChatComponent,
    ScenarioComponent,
    PatientComponent,
    PatientDetailComponent,
    RolesComponent,
    DoctorDialogComponent,
    PatientDialogComponent,
    MovePatientDialogComponent,
    PatientInfoDialogComponent,
    NotificationDialogComponent,
    InputDialogComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    MdDataTableModule,
    BrowserAnimationsModule,

    MaterialModule.forRoot() //deprecated!!!

  ],
  providers: [UserService,AdminService,ChatService],
  bootstrap: [AppComponent],
  entryComponents:[

    DoctorDialogComponent,
    PatientDialogComponent,
    MovePatientDialogComponent,
    PatientInfoDialogComponent,
    NotificationDialogComponent,
    InputDialogComponent
  ]
})
export class AppModule { }
