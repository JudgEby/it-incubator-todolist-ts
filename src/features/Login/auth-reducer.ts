import {
	SetAppErrorActionType,
	setAppStatusAC,
	SetAppStatusActionType,
} from '../../app/app-reducer'
import { authAPI } from '../../api/todolists-api'
import {
	handleServerAppError,
	handleServerNetworkError,
} from '../../utils/error-utils'
import { AppThunk } from '../../app/store'

const initialState = {
	isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (
	state: InitialStateType = initialState,
	action: AuthActionsType
): InitialStateType => {
	switch (action.type) {
		case 'login/SET-IS-LOGGED-IN':
			return { ...state, isLoggedIn: action.value }
		default:
			return state
	}
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
	({ type: 'login/SET-IS-LOGGED-IN', value } as const)
export const clearSateAC = () => ({ type: 'login/CLEAR-STATE' } as const)

// thunks
export const loginTC =
	(data: any): AppThunk =>
	async dispatch => {
		try {
			dispatch(setAppStatusAC('loading'))
			const res = await authAPI.login(data)
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC(true))
				dispatch(setAppStatusAC('succeeded'))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		} catch (error) {
			handleServerNetworkError(error, dispatch)
		}
	}

export const logoutTC = (): AppThunk => dispatch => {
	dispatch(setAppStatusAC('loading'))
	authAPI
		.logout()
		.then(res => {
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC(false))
				dispatch(clearSateAC())
				dispatch(setAppStatusAC('succeeded'))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch(error => {
			handleServerNetworkError(error, dispatch)
		})
}

// types
export type ClearStateActionType = ReturnType<typeof clearSateAC>

export type AuthActionsType =
	| ReturnType<typeof setIsLoggedInAC>
	| SetAppStatusActionType
	| SetAppErrorActionType
