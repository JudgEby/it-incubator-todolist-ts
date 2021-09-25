import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { RequestStatusType, setAppStatusAC } from '../../app/app-reducer'
import { AppThunk } from '../../app/store'
import {
	handleServerAppError,
	handleServerNetworkError,
} from '../../utils/error-utils'
import { fetchTasksTC } from './tasks-reducer'
import { clearSateAC, ClearStateActionType } from '../Login/auth-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
	name: 'todolists',
	initialState: initialState,
	reducers: {
		removeTodolistAC: (state, action: PayloadAction<{ id: string }>) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			if (index > -1) {
				state.splice(index, 1)
			}
		},
		addTodolistAC: (
			state,
			action: PayloadAction<{ todolist: TodolistType }>
		) => {
			state.unshift({
				...action.payload.todolist,
				filter: 'all',
				entityStatus: 'idle',
			})
		},
		changeTodolistTitleAC: (
			state,
			action: PayloadAction<{ id: string; title: string }>
		) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			if (index > -1) {
				state[index].title = action.payload.title
			}
		},
		changeTodolistFilterAC: (
			state,
			action: PayloadAction<{ id: string; filter: FilterValuesType }>
		) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			if (index > -1) {
				state[index].filter = action.payload.filter
			}
		},
		changeTodolistEntityStatusAC: (
			state,
			action: PayloadAction<{ id: string; status: RequestStatusType }>
		) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			if (index > -1) {
				state[index].entityStatus = action.payload.status
			}
		},
		setTodolistsAC: (
			state,
			action: PayloadAction<{ todolists: Array<TodolistType> }>
		) => {
			action.payload.todolists.forEach(tl =>
				state.push({
					...tl,
					filter: 'all',
					entityStatus: 'idle',
				})
			)
		},
	},
	extraReducers: {
		[clearSateAC.type]: state => {
			state.splice(0)
		},
	},
	// extraReducers: {
	// 	'auth/clearSateAC': state => {
	// 		state.splice(0)
	// 	},
	// },
	// extraReducers: builder => {
	// 	builder.addCase(clearSateAC, state => {
	// 		state.splice(0)
	// 	})
	// },
})

export const todolistsReducer = slice.reducer

// actions
export const {
	removeTodolistAC,
	addTodolistAC,
	changeTodolistEntityStatusAC,
	changeTodolistFilterAC,
	changeTodolistTitleAC,
	setTodolistsAC,
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
	try {
		dispatch(setAppStatusAC({ status: 'loading' }))
		const res = await todolistsAPI.getTodolists()
		if (Array.isArray(res.data)) {
			dispatch(setTodolistsAC({ todolists: res.data }))
			res.data.forEach(tl => {
				dispatch(fetchTasksTC(tl.id))
			})
			dispatch(setAppStatusAC({ status: 'succeeded' }))
		} else {
			const data = {
				resultCode: 1,
				messages: [res.data.message],
				data: {},
			}
			handleServerAppError(data, dispatch)
		}
	} catch (e) {
		handleServerNetworkError(e, dispatch)
	}
}

export const removeTodolistTC =
	(todolistId: string): AppThunk =>
	dispatch => {
		//изменим глобальный статус приложения, чтобы вверху полоса побежала
		dispatch(setAppStatusAC({ status: 'loading' }))
		//изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
		dispatch(
			changeTodolistEntityStatusAC({ id: todolistId, status: 'loading' })
		)
		todolistsAPI.deleteTodolist(todolistId).then(res => {
			dispatch(removeTodolistAC({ id: todolistId }))
			//скажем глобально приложению, что асинхронная операция завершена
			dispatch(setAppStatusAC({ status: 'succeeded' }))
		})
	}

export const addTodolistTC =
	(title: string): AppThunk =>
	dispatch => {
		dispatch(setAppStatusAC({ status: 'loading' }))
		todolistsAPI.createTodolist(title).then(res => {
			dispatch(addTodolistAC({ todolist: res.data.data.item }))
			dispatch(setAppStatusAC({ status: 'succeeded' }))
		})
	}

export const changeTodolistTitleTC =
	(id: string, title: string): AppThunk =>
	dispatch => {
		todolistsAPI.updateTodolist(id, title).then(res => {
			dispatch(changeTodolistTitleAC({ id, title }))
		})
	}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type TodoListActionsType =
	| RemoveTodolistActionType
	| AddTodolistActionType
	| ReturnType<typeof changeTodolistTitleAC>
	| ReturnType<typeof changeTodolistFilterAC>
	| SetTodolistsActionType
	| ReturnType<typeof changeTodolistEntityStatusAC>
	| ClearStateActionType

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}
