/**
 * Created by asoadmin on 2017-04-29.
 */
export type ScenarioDuration = 15 | 20 | 25 ;

export interface PaginableScenarios {
  scenarios: Scenario[];
  pagination: Pagination;
}

export interface Scenario {
  _id: string;
  name: string;
  description: string;
  duration: ScenarioDuration;
  metana_report:string,
  nPatients:number,
  patients:[string],
  maxReservedNurses:number,
  nBusyRooms:number,
  info_bakjour:string

}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
}
