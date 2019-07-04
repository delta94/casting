import { filter, pluck, map, exhaustMap, tap, mergeMap } from 'rxjs/operators'
import { combineEpics } from 'redux-observable'
import { isActionOf } from 'typesafe-actions'
import { History } from 'history'

import { Epic } from 'Config/rootEpic'
import { showNotification } from 'Modules/Notification/actions'
import { registerNotificationSucceed } from 'Modules/Notification/factory'
import { AuthService } from './service'
import * as actions from './actions'

export const authEpicFactory = (
    authService: AuthService,
    history: History
): Epic => {
    const loginEpic: Epic = action$ =>
        action$.pipe(
            filter(isActionOf(actions.loginAsync.request)),
            pluck('payload'),
            exhaustMap(variables => authService.login(variables)),
            tap(res => authService.saveToken(res.data.login)),
            map(res => actions.loginAsync.success(res.data.login)),
            tap(() => history.push('/castings'))
        )

    const registerEpic: Epic = action$ =>
        action$.pipe(
            filter(isActionOf(actions.registerAsync.request)),
            pluck('payload'),
            exhaustMap(variables => authService.register(variables)),
            mergeMap(res => [
                actions.registerAsync.success(res.data.register),
                showNotification(registerNotificationSucceed())
            ])
        )

    return combineEpics(loginEpic, registerEpic)
}
