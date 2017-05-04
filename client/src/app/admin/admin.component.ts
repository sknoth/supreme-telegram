import { Component, OnInit,AfterViewInit, OnDestroy,ViewChild } from '@angular/core';
import {Router} from '@angular/router';
//import { UserService } from '../user.service';


import { IScenario } from '../admin.interfaces';
import {AdminService} from '../admin.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { shuffle } from 'lodash-es';
import { async } from 'rxjs/scheduler/async';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/takeUntil';


import {
  MdDataTableComponent,
  MdDataTablePaginationComponent,
  IDatatableSelectionEvent,
  IDatatableSortEvent,
  IDatatablePaginationEvent,
  DatatableSortType,
} from 'ng2-md-datatable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit,AfterViewInit, OnDestroy {


  scenarios: IScenario[];
  scenarios$: Observable<IScenario[]>;


  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  currentSelection: string[];
  currentSortBy: string;
  currentSortType: DatatableSortType;

  @ViewChild(MdDataTableComponent) datatable: MdDataTableComponent;
  @ViewChild(MdDataTablePaginationComponent) pagination: MdDataTablePaginationComponent;

  private _scenarios$: BehaviorSubject<IScenario[]> = new BehaviorSubject<IScenario[]>([]);
  private unmount$: Subject<void> = new Subject<void>();

  constructor(private _adminService: AdminService, private router: Router) {
    this.scenarios$ = this._scenarios$;
  }

  ngOnInit() {
    console.log("onInit");
    this._adminService.getScenarios().subscribe(
      (data) => {
        console.log(data);
        this.scenarios = data;
        this.fetchDataSource(data,1,10);
      }
    );
  }


  ngAfterViewInit() {
    console.log("AfterViewinit");
    if (this.datatable) {
      Observable.from(this.datatable.selectionChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatableSelectionEvent) => this.currentSelection = e.selectedValues);

      Observable.from(this.datatable.sortChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatableSortEvent) =>
          this.fetchDataSource(this.scenarios,this.currentPage, this.itemsPerPage, e.sortBy, e.sortType));

      Observable.from(this.pagination.paginationChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatablePaginationEvent) =>
          this.fetchDataSource(this.scenarios,e.page, e.itemsPerPage));
    }
  }

  ngOnDestroy() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  shuffleData() {
    const currentScenarios: IScenario[] = this._scenarios$.getValue();
    this._scenarios$.next(shuffle(currentScenarios));
  }

  private fetchDataSource(
    data:IScenario[]=this.scenarios,
    page: number = this.currentPage,
    limit: number = this.itemsPerPage,
    sortBy: string = this.currentSortBy,
    sortType: DatatableSortType = this.currentSortType,
  ) {
    if (sortBy) {
      this.currentSortBy = sortBy;
      this.currentSortType = sortType;
    }

    const { scenarios, pagination } = this._adminService
      .getScenariosData(data,page, limit, sortBy, sortType);

    this._scenarios$.next(scenarios);
    this.currentPage = pagination.currentPage;
    this.itemsPerPage = pagination.itemsPerPage;
    this.totalCount = pagination.totalCount;
    this.currentSelection = [];
  }


  createScenario(){
    console.log("create scenario click ");
    this.router.navigate(['/scenario']);

  }

}
