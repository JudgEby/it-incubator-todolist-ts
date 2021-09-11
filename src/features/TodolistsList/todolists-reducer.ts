import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { RequestStatusType, setAppStatusAC } from '../../app/app-reducer'
import { AppThunk } from '../../app/store'
import {
	handleServerAppError,
	handleServerNetworkError,
} from '../../utils/error-utils'
import { addTaskAC, fetchTasksTC } from './tasks-reducer'
import { ClearStateActionType } from '../Login/auth-reducer'

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (
	state: Array<TodolistDomainType> = initialState,
	action: TodoListActionsType
): Array<TodolistDomainType> => {
	switch (action.type) {
		case 'REMOVE-TODOLIST':
			return state.filter(tl => tl.id != action.id)
		case 'ADD-TODOLIST':
			return [
				{ ...action.todolist, filter: 'all', entityStatus: 'idle' },
				...state,
			]

		case 'CHANGE-TODOLIST-TITLE':
			return state.map(tl =>
				tl.id === action.id ? { ...tl, title: action.title } : tl
			)
		case 'CHANGE-TODOLIST-FILTER':
			return state.map(tl =>
				tl.id === action.id ? { ...tl, filter: action.filter } : tl
			)
		case 'CHANGE-TODOLIST-ENTITY-STATUS':
			return state.map(tl =>
				tl.id === action.id ? { ...tl, entityStatus: action.status } : tl
			)
		case 'SET-TODOLISTS':
			return action.todolists.map(tl => ({
				...tl,
				filter: 'all',
				entityStatus: 'idle',
			}))
		case 'login/CLEAR-STATE':
			return []
		default:
			return state
	}
}

// actions
export const removeTodolistAC = (id: string) =>
	({ type: 'REMOVE-TODOLIST', id } as const)
export const addTodolistAC = (todolist: TodolistType) =>
	({ type: 'ADD-TODOLIST', todolist } as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
	({
		type: 'CHANGE-TODOLIST-TITLE',
		id,
		title,
	} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
	({
		type: 'CHANGE-TODOLIST-FILTER',
		id,
		filter,
	} as const)
export const changeTodolistEntityStatusAC = (
	id: string,
	status: RequestStatusType
) =>
	({
		type: 'CHANGE-TODOLIST-ENTITY-STATUS',
		id,
		status,
	} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
	({ type: 'SET-TODOLISTS', todolists } as const)

// thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
	try {
		dispatch(setAppStatusAC('loading'))
		const res = await todolistsAPI.getTodolists()
		if (Array.isArray(res.data)) {
			dispatch(setTodolistsAC(res.data))
			res.data.forEach(tl => {
				dispatch(fetchTasksTC(tl.id))
			})
			dispatch(setAppStatusAC('succeeded'))
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
		dispatch(setAppStatusAC('loading'))
		//изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
		dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
		todolistsAPI.deleteTodolist(todolistId).then(res => {
			dispatch(removeTodolistAC(todolistId))
			//скажем глобально приложению, что асинхронная операция завершена
			dispatch(setAppStatusAC('succeeded'))
		})
	}

export const addTodolistTC =
	(title: string): AppThunk =>
	dispatch => {
		dispatch(setAppStatusAC('loading'))
		todolistsAPI.createTodolist(title).then(res => {
			dispatch(addTodolistAC(res.data.data.item))
			dispatch(setAppStatusAC('succeeded'))
		})
	}

export const changeTodolistTitleTC =
	(id: string, title: string): AppThunk =>
	dispatch => {
		todolistsAPI.updateTodolist(id, title).then(res => {
			dispatch(changeTodolistTitleAC(id, title))
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
