/**
 * Created by asoadmin on 2017-04-29.
 */
/*IScenario*/
export type ScenarioDuration = 15 | 20 | 25 ;


export interface PaginableScenarios {
  scenarios: IScenario[];
  pagination: Pagination;
}
/*IScenario*/
export interface IScenario {
  _id?: string;
  name: string;
  description: string;
  duration: ScenarioDuration;
  metana_report:string,
  ashet_report:string,
  nPatients:number,
  patients?:[IPatient],
  maxReservedNurses:number,
  nBusyRooms:number,
  info_bakjour:string

}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
}


/*IUser*/

export interface IUser {
  _id?:string,
  name:string,
  surname:string,
  scenarioId?:string,
  role:string,
  team?:ITeam,
  points?:number,
  actions?:[Object],
  patients?:[IPatient],
  location?:Object
}

export interface ITeam {
  name:string,
  doctor:string,
  x:number,
  y:number
}


/*IPatient*/

export interface IPatient {
  _id?:string,
  identificator:string,// patient A, patient B, etc.
  name: string,
  age: number,
  gender:string,
  triage:string,//[RED,ORANGE,YELLOW,GREEN,BLACK]
  description?: string, //general description
  airway?:IAirway,//{type:[OK, THREAD,BLOCKED],description:String}
  breathing?:IBreathing, //{RP:[Fast >30,Normal >10 >30,etc.],SPO2:String,CIANOSIS:[etc.], description:String}
  circulation?:ICirculation,//similar to breathing see table from the scenario + casuality card
  disability?:IDisability,//similar to breathing see table from the scenario + casuality card
  exposure?:IExposure,//similar to breathing see table from the scenario + casuality card
  scenarioId:string,
  /**Updated fields**/
  provided_treatments?:[string],// list of treatments has been chosen by a nurse/team
  teams?:[string], // teams that were assigned to this patient, we assume by default one team, but can be that two teams treat one patient
  locations?:[string],   //was send by nurse to Corridor,AVA,OP,IVA, X-REY, etc.
  coordinates?:{x:number,y:number},
  imgUrl?:string,
  visibility?:string
}

export interface IAirway {
   type?:string,
   description?:string,
   selectedTreatments?:[string]

}
export interface IBreathing {
  af?: number,
  spo2: number,
  bfrequency?: number,
  description?: string,
  selectedTreatments?:[string],

}

export interface ICirculation {
  bt?: string,
  pulse?: number,
  skinType?: string,
  mucusColor?: string,
  capillary?: string,
  description?:string,
  selectedTreatments?:[string],

}
export interface IDisability {
  rls?: string,
  gcs: number,
  glucose?: number,
  description?:string,
  selectedTreatments?:[string],

}
export interface IExposure {
  temperature?: number,
  description?: string,
  selectedTreatments?:[string],

}

/*IGame*/

export interface IGame {
  _id?:string;
  scenario?: IScenario, //scenarioId

  /**Fields that will be updated later in the game**/
  leader?:IUser,//leader that has been log in to the game and played the game: leader id
  teams?: IUser[], //teams that has been login to the game and played the game: user ids
  totalActions: number,// total number of actions made by all teams and leader together
  timeSpend:string,//time when spent to finish the game in string format mm:ss (minutes:seconds)
  result?:string,//the overall result of the game: result id
  isStarted?:boolean,
  isPlayed?:boolean

}
