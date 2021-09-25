import { authAPI } from '../api/todolists-api'
import { setIsLoggedInAC } from '../features/Login/auth-reducer'
import {
	handleServerAppError,
	handleServerNetworkError,
} from '../utils/error-utils'
import { AppThunk } from './store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	status: 'idle' as RequestStatusType,
	error: null as string | null,
	isInitialized: false,
}

const slice = createSlice({
	name: 'app',
	initialState: initialState,
	reducers: {
		setAppErrorAC: (
			state,
			action: PayloadAction<{ error: string | null }>
		) => {
			state.error = action.payload.error
		},
		setAppStatusAC: (
			state,
			action: PayloadAction<{ status: RequestStatusType }>
		) => {
			state.status = action.payload.status
		},
		setIsInitialized: (
			state,
			action: PayloadAction<{ isInitialized: boolean }>
		) => {
			state.isInitialized = action.payload.isInitialized
		},
	},
})

export const appReducer = slice.reducer

// 	(
// 	state: InitialStateType = initialState,
// 	action: AppActionsType
// ): InitialStateType => {
// 	switch (action.type) {
// 		case 'APP/SET-STATUS':
// 			return { ...state, status: action.status }
// 		case 'APP/SET-ERROR':
// 			return { ...state, error: action.error }
// 		case 'APP/IS-INITIALIZED':
// 			return { ...state, isInitialized: action.isInitialized }
// 		default:
// 			return { ...state }
// 	}
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// export type InitialStateType = {
// 	// происходит ли сейчас взаимодействие с сервером
// 	status: RequestStatusType
// 	// если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
// 	error: string | null
// 	isInitialized: boolean
// }

export const { setAppErrorAC, setAppStatusAC, setIsInitialized } = slice.actions

// export const setAppErrorAC = (error: string | null) =>
// 	({ type: 'APP/SET-ERROR', error } as const)
// export const setAppStatusAC = (status: RequestStatusType) =>
// 	({ type: 'APP/SET-STATUS', status } as const)
// export const setIsInitialized = (isInitialized: boolean) =>
// 	({ type: 'APP/IS-INITIALIZED', isInitialized } as const)

export const initializeAppTC = (): AppThunk => async dispatch => {
	try {
		dispatch(setAppStatusAC({ status: 'loading' }))
		const res = await authAPI.me()
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedInAC({ value: true }))

			dispatch(setAppStatusAC({ status: 'succeeded' }))
		} else {
			handleServerAppError(res.data, dispatch)
		}
	} catch (error) {
		handleServerNetworkError(error, dispatch)
	} finally {
		dispatch(setIsInitialized({ isInitialized: true }))
	}
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppIsInitializedActionType = ReturnType<typeof setIsInitialized>

export type AppActionsType =
	| SetAppErrorActionType
	| SetAppStatusActionType
	| SetAppIsInitializedActionType
