import {
    filter,
    pluck,
    map,
    exhaustMap,
    tap,
    mergeMap,
    catchError,
    switchMap
} from 'rxjs/operators'
import { combineEpics } from 'redux-observable'
import { isActionOf } from 'typesafe-actions'
import { from } from 'rxjs'

import { Epic } from 'Config/rootEpic'
import { RoutingService } from 'Common/Services/routingService'
import { showNotification } from 'Modules/Notification/actions'
import { authNotificationsFactory } from './notifications'
import { AuthService } from './service'
import * as actions from './actions'

export const authEpicFactory = (
    authService: AuthService,
    routingService: RoutingService,
    notificationFactory: ReturnType<typeof authNotificationsFactory>
): Epic => {
    const loginEpic: Epic = action$ =>
        action$.pipe(
            filter(isActionOf(actions.loginAsync.request)),
            pluck('payload'),
            exhaustMap(variables => authService.login(variables)),
            tap(res => authService.saveToken(res.data.login)),
            map(res => actions.loginAsync.success(res.data.login)),
            tap(() => routingService.push('/castings')),
            catchError(err =>
                from([
                    actions.loginAsync.failure(),
                    showNotification(
                        notificationFactory.loginNotificationFailed(err)
                    )
                ])
            )
        )

    const registerEpic: Epic = action$ =>
        action$.pipe(
            filter(isActionOf(actions.registerAsync.request)),
            pluck('payload'),
            exhaustMap(variables => authService.register(variables)),
            mergeMap(res => [
                actions.registerAsync.success(res.data.register),
                showNotification(
                    notificationFactory.registerNotificationSucceed()
                )
            ]),
            catchError(err =>
                from([
                    actions.registerAsync.failure(),
                    showNotification(
                        notificationFactory.registerNotificationFailed(err)
                    )
                ])
            )
        )

    const meEpic: Epic = action$ =>
        action$.pipe(
            filter(isActionOf(actions.getMeAsync.request)),
            pluck('payload'),
            switchMap(() => authService.me()),
            map(res => actions.getMeAsync.success(res)),
            catchError(() =>
                from([
                    actions.getMeAsync.failure(),
                    showNotification(
                        notificationFactory.notAuthenticatedNotification()
                    )
                ])
            )
        )

    return combineEpics(loginEpic, registerEpic, meEpic)
}
