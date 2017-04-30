import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MdDataTableModule } from 'ng2-md-datatable';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamemapComponent } from './gamemap/gamemap.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';



import { UserService } from './user.service';
import { ChatComponent } from './chat/chat.component';
import { LobbyComponent } from './lobby/lobby.component';
import {AdminService} from "./admin.service";

@NgModule({
  declarations: [
    AppComponent,
    GamemapComponent,
    LoginComponent,
    AdminComponent,
    ChatComponent,
    LobbyComponent
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
    BrowserAnimationsModule

  ],
  providers: [UserService,AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
