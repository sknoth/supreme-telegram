import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamemapComponent } from './gamemap/gamemap.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ChatComponent } from './chat/chat.component';
import {ScenarioComponent} from './admin/scenario.component';
import {PatientComponent} from "./admin/patient.component";
import {PatientDetailComponent} from "./admin/patient-detail.component";
import {RolesComponent} from "./login/roles.component";
import {NurseComponent} from "./nurse/nurse.component";
import {ScoreComponent} from "./score/score.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'gamemap/:scenarioId',
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
  },
  {
    path:'scenario',
    component:ScenarioComponent
  },
  {
    path:'patient/:id',
    component:PatientComponent
  },
  {
    path:'patient-detail',
    component:PatientDetailComponent
  },
  {
    path:'roles/:name/:surname/:scenario',
    component:RolesComponent
  },
  {
    path:'nurse/:room/:patientId',
    component:NurseComponent
  },
  {
    path:'score',
    component:ScoreComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
