import * as AuthActions from './auth'
import * as LinesActions from './lines'
import * as RegionActions from './region'

export const ActionCreators = Object.assign({}, AuthActions, LinesActions, RegionActions)
