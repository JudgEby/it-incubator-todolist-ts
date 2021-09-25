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
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	isLoggedIn: false,
}

const slice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		setIsLoggedInAC: (state, action: PayloadAction<{ value: boolean }>) => {
			state.isLoggedIn = action.payload.value
		},
	},
})

export const authReducer = slice.reducer
// 	(
// 	state: InitialStateType = initialState,
// 	action: AuthActionsType
// ): InitialStateType => {
// 	switch (action.type) {
// 		case 'login/SET-IS-LOGGED-IN':
// 			return { ...state, isLoggedIn: action.value }
// 		default:
// 			return state
// 	}
// }
// actions

export const { setIsLoggedInAC } = slice.actions

// export const setIsLoggedInAC = (value: boolean) =>
// 	({ type: 'login/SET-IS-LOGGED-IN', value } as const)
export const clearSateAC = () => ({ type: 'login/CLEAR-STATE' } as const)

// thunks
export const loginTC =
	(data: any): AppThunk =>
	async dispatch => {
		try {
			dispatch(setAppStatusAC({ status: 'loading' }))
			const res = await authAPI.login(data)
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC({ value: true }))
				dispatch(setAppStatusAC({ status: 'succeeded' }))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		} catch (error) {
			handleServerNetworkError(error, dispatch)
		}
	}

export const logoutTC = (): AppThunk => dispatch => {
	dispatch(setAppStatusAC({ status: 'loading' }))
	authAPI
		.logout()
		.then(res => {
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC({ value: false }))
				dispatch(clearSateAC())
				dispatch(setAppStatusAC({ status: 'succeeded' }))
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
