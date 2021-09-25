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

//actions
export const { setAppErrorAC, setAppStatusAC, setIsInitialized } = slice.actions

//thunks
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

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppIsInitializedActionType = ReturnType<typeof setIsInitialized>

export type AppActionsType =
	| SetAppErrorActionType
	| SetAppStatusActionType
	| SetAppIsInitializedActionType
