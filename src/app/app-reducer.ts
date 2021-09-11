import { authAPI } from '../api/todolists-api'
import { setIsLoggedInAC } from '../features/Login/auth-reducer'
import {
	handleServerAppError,
	handleServerNetworkError,
} from '../utils/error-utils'
import { AppThunk } from './store'

const initialState: InitialStateType = {
	status: 'idle',
	error: null,
	isInitialized: false,
}

export const appReducer = (
	state: InitialStateType = initialState,
	action: AppActionsType
): InitialStateType => {
	switch (action.type) {
		case 'APP/SET-STATUS':
			return { ...state, status: action.status }
		case 'APP/SET-ERROR':
			return { ...state, error: action.error }
		case 'APP/IS-INITIALIZED':
			return { ...state, isInitialized: action.isInitialized }
		default:
			return { ...state }
	}
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
	// происходит ли сейчас взаимодействие с сервером
	status: RequestStatusType
	// если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
	error: string | null
	isInitialized: boolean
}

export const setAppErrorAC = (error: string | null) =>
	({ type: 'APP/SET-ERROR', error } as const)
export const setAppStatusAC = (status: RequestStatusType) =>
	({ type: 'APP/SET-STATUS', status } as const)
export const setIsInitialized = (isInitialized: boolean) =>
	({ type: 'APP/IS-INITIALIZED', isInitialized } as const)

export const initializeAppTC = (): AppThunk => async dispatch => {
	try {
		dispatch(setAppStatusAC('loading'))
		const res = await authAPI.me()
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedInAC(true))

			dispatch(setAppStatusAC('succeeded'))
		} else {
			handleServerAppError(res.data, dispatch)
		}
	} catch (error) {
		handleServerNetworkError(error, dispatch)
	} finally {
		dispatch(setIsInitialized(true))
	}
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppIsInitializedActionType = ReturnType<typeof setIsInitialized>

export type AppActionsType =
	| SetAppErrorActionType
	| SetAppStatusActionType
	| SetAppIsInitializedActionType