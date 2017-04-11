import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamemapComponent } from './gamemap/gamemap.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    children: []
  },
  {
    path: 'gamemap',
    component: GamemapComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
