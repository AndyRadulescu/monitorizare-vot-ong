import { StatisticsStateItem } from '../../store/statistics/statistics.state';

import { Observable, Observer } from 'rxjs/Rx';
import { LoadStatisticAction } from '../../store/statistics/statistics.actions';
import { AppState } from '../../store/store.module';
import { Store } from '@ngrx/store';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, values } from 'lodash';
@Injectable()
export class LoadStatisticsGuard implements CanActivate {
    constructor(private store: Store<AppState>) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route.params['key']) {
            this.store
                .select(s => s.statistics[route.params['key']])
                .take(1)
                .map(s => new LoadStatisticAction(s.key, 1, 20, true))
                .subscribe(a => this.store.dispatch(a));
        } else {
            this.store
                .select(s => s.statistics)
                .take(1)
                // .do(console.log)
                .map(s => values(s))
                .concatMap(s => Observable.from(s))
                // .do(console.log)
                .map((i: StatisticsStateItem) => new LoadStatisticAction(i.key, 1, 5, true))
                .subscribe(a => this.store.dispatch(a));
        }
        return Observable.of(true);

    }
}