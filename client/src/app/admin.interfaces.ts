/**
 * Created by asoadmin on 2017-04-29.
 */
/*IScenario*/
export type ScenarioDuration = 15 | 20 | 25 ;



export interface PaginableScenarios {
  scenarios: IScenario[];
  pagination: Pagination;
}

export interface IScenario {
  _id?: string;
  name: string;
  description: string;
  duration: ScenarioDuration;
  metana_report:string,
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

/*IPatient*/
export type PatientType = "RED"|"ORANGE"|"YELLOW"|"GREEN"|"BLACK";

export interface IPatient{
  _id?:string,
  identificator:string,// patient A, patient B, etc.
  name: string,
  age: number,
  gender:string,
  triage:PatientType,//[RED,ORANGE,YELLOW,GREEN,BLACK]
  injures: [{type:string}], //list of injures
  airway:IAirway,//{type:[OK, THREAD,BLOCKED],description:String}
  breathing:IBreathing, //{RP:[Fast >30,Normal >10 >30,etc.],SPO2:String,CIANOSIS:[etc.], description:String}
  circulation:ICirculation,//similar to breathing see table from the scenario + casuality card
  disability:IDisability,//similar to breathing see table from the scenario + casuality card
  exposure:IExposure,//similar to breathing see table from the scenario + casuality card
  scenarioId:string,
  /**Updated fields**/
  provided_treatments?:[string],// list of treatments has been chosen by a nurse/team
  teams?:[{type:string}], // teams that were assigned to this patient, we assume by default one team, but can be that two teams treat one patient
  location?:string   //was send by nurse to Corridor,AVA,OP,IVA, X-REY, etc.

}

export interface IAirway{
   type:string,
   description:string,
   selectedTreatments:[string]
}
export interface IBreathing{
  af: number,
  spo2: number,
  bfrequency: number,
  description: string,
  selectedTreatments:[string]
}

export interface ICirculation{
  bt: string,
  pulse: number,
  skinType: string,
  mucusColor: string,
  capillary: string,
  description:string,
  selectedTreatments:[string]
}
export interface IDisability{
  rls: string,
  gcs: number,
  glucose: number,
  description:string,
  selectedTreatments:[string]
}
export interface IExposure{
  temperature: number,
  description: string,
  selectedTreatments:[string]
}
