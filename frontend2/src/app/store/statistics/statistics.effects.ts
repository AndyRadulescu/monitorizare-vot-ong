import { StatisticsState } from './statistics.state';
import { Store } from '@ngrx/store';
import { AppState } from '../store.module';
import { shouldLoadPage } from '../../shared/pagination.service';
import { statisticsConfig } from './statistics.config';
import { LoadStatisticAction, LoadStatisticsCompleteAction, StatisticsActions } from './statistics.actions';
import { ApiService } from '../../core/apiService/api.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { LabelValueModel } from '../../models/labelValue.model';
import { filter, flatMap, groupBy, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsEffects {

  state: StatisticsState;
  @Effect()
  loadStats = this.actions.pipe(
    ofType(StatisticsActions.LOAD)
    , map(a => a as LoadStatisticAction)
    , filter(
      (a: LoadStatisticAction) => shouldLoadPage(a.payload.page, a.payload.pageSize, this.state[a.payload.key].values.length))
    , groupBy(a => a.payload.key)
    , flatMap((obs: Observable<any>) =>
      obs.pipe(
        switchMap((a) =>
          this.http.get<{ data: LabelValueModel[], totalPages: number, totalItems: number }>
          (`/api/v1/statistici/${ statisticsConfig.find(value => value.key === a.payload.key).method }`, {
            body: {
              page: a.payload.page,
              pageSize: a.payload.pageSize
            }
          }).pipe(map(res => {
            return {
              key: a.payload.key,
              json: res
            };
          })))
      )
    ),
    // .switchMap((a: any) =>
    //     this.http.get(`/api/v1/statistici/${statisticsConfig.find(value => value.key === a.payload.key).method}`, {
    //         body: {
    //             page: a.payload.page,
    //             pageSize: a.payload.pageSize
    //         }
    //     }).map(res => {
    //         return {
    //             key: a.payload.key,
    //             json: res.json()
    //         }
    //     })

    // )

    map(value => new LoadStatisticsCompleteAction(value.key, value.json.data, value.json.totalPages, value.json.totalItems)));

  constructor(private http: ApiService, private actions: Actions, private store: Store<AppState>) {
    store.select(s => s.statistics).subscribe(s => this.state = s);
  }
}