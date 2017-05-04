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
import { GamemapComponent } from './gamemap/gamemap.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import {ScenarioComponent} from './admin/scenario.component';
import {PatientComponent} from './admin/patient.component';
import {PatientDetailComponent} from './admin/patient-detail.component';
import { ChatComponent } from './chat/chat.component';



import { UserService } from './user.service';
import {AdminService} from "./admin.service";


//Material components used in this application
import { MaterialModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    GamemapComponent,
    LoginComponent,
    AdminComponent,
    ChatComponent,
    ScenarioComponent,
    PatientComponent,
    PatientDetailComponent

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
  providers: [UserService,AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
