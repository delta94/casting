import { combineEpics, Epic as _Epic } from 'redux-observable'

import { castingEpicFactory } from 'Modules/Casting/epic'
import { AppAction } from './rootAction'

export type Epic = _Epic<AppAction, AppAction>

export const rootEpic = combineEpics(castingEpicFactory())