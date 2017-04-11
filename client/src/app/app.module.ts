import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamemapComponent } from './gamemap/gamemap.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

import { UserService } from './user.service';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    GamemapComponent,
    LoginComponent,
    AdminComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
