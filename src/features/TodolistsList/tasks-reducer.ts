import {
	AddTodolistActionType,
	RemoveTodolistActionType,
	SetTodolistsActionType,
} from './todolists-reducer'
import {
	TaskPriorities,
	TaskStatuses,
	TaskType,
	todolistsAPI,
	TodolistType,
	UpdateTaskModelType,
} from '../../api/todolists-api'
import { AppThunk } from '../../app/store'
import { setAppStatusAC } from '../../app/app-reducer'
import {
	handleServerAppError,
	handleServerNetworkError,
} from '../../utils/error-utils'
import { ClearStateActionType } from '../Login/auth-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TasksStateType = {}

const slice = createSlice({
	name: 'tasks',
	initialState: initialState,
	reducers: {
		removeTaskAC: (
			state,
			action: PayloadAction<{ taskId: string; todolistId: string }>
		) => {
			const tasksArray = state[action.payload.todolistId]
			const index = tasksArray.findIndex(
				task => task.id === action.payload.taskId
			)
			if (index > -1) {
				tasksArray.splice(index, 1)
			}
		},
		addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
			state[action.payload.task.todoListId].unshift({
				...action.payload.task,
			})
		},
		updateTaskAC: (
			state,
			action: PayloadAction<{
				taskId: string
				model: UpdateDomainTaskModelType
				todolistId: string
			}>
		) => {
			const tasksArray = state[action.payload.todolistId]
			const index = tasksArray.findIndex(
				task => task.id === action.payload.taskId
			)
			if (index > -1) {
				tasksArray[index] = {
					...tasksArray[index],
					...action.payload.model,
				}
			}
		},
		setTasksAC: (
			state,
			action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
		) => {
			state[action.payload.todolistId] = action.payload.tasks
		},
	},
	extraReducers: {
		'todolists/addTodolistAC': (
			state,
			action: PayloadAction<{ todolist: TodolistType }>
		) => {
			state[action.payload.todolist.id] = []
		},
		'todolists/removeTodolistAC': (
			state,
			action: PayloadAction<{ id: string }>
		) => {
			delete state[action.payload.id]
		},
		'todolists/setTodolistsAC': (
			state,
			action: PayloadAction<{ todolists: Array<TodolistType> }>
		) => {
			action.payload.todolists.forEach(tl => (state[tl.id] = []))
		},
		'auth/clearSateAC': () => {
			return {}
		},
	},
	// extraReducers: {
	// 	'todolists/addTodolistAC': (
	// 		state,
	// 		action: PayloadAction<{ todolist: TodolistType }>
	// 	) => {
	// 		state[action.payload.todolist.id] = []
	// 	},
	// 	'todolists/removeTodolistAC': (
	// 		state,
	// 		action: PayloadAction<{ id: string }>
	// 	) => {
	// 		delete state[action.payload.id]
	// 	},
	// 	'todolists/setTodolistsAC': (
	// 		state,
	// 		action: PayloadAction<{ todolists: Array<TodolistType> }>
	// 	) => {
	// 		action.payload.todolists.forEach(tl => (state[tl.id] = []))
	// 	},
	// 	'auth/clearSateAC': () => {
	// 		return {}
	// 	},
	// },

	// extraReducers: builder => {
	// 	builder.addCase(addTodolistAC, (state, action) => {
	// 		state[action.payload.todolist.id] = []
	// 	})
	// 	builder.addCase(removeTodolistAC, (state, action) => {
	// 		delete state[action.payload.id]
	// 	})
	// 	builder.addCase(setTodolistsAC, (state, action) => {
	// 		action.payload.todolists.forEach(tl => (state[tl.id] = []))
	// 	})
	// 	builder.addCase(clearSateAC, () => {
	// 		return {}
	// 	})
	// },
})

export const tasksReducer = slice.reducer

// actions
export const { setTasksAC, removeTaskAC, updateTaskAC, addTaskAC } =
	slice.actions

// thunks
export const fetchTasksTC =
	(todolistId: string): AppThunk =>
	dispatch => {
		dispatch(setAppStatusAC({ status: 'loading' }))
		todolistsAPI.getTasks(todolistId).then(res => {
			const tasks = res.data.items
			dispatch(setTasksAC({ tasks, todolistId }))
			dispatch(setAppStatusAC({ status: 'succeeded' }))
		})
	}

export const removeTaskTC =
	(taskId: string, todolistId: string): AppThunk =>
	dispatch => {
		todolistsAPI.deleteTask(todolistId, taskId).then(res => {
			const action = removeTaskAC({ taskId, todolistId })
			dispatch(action)
		})
	}
export const addTaskTC =
	(title: string, todolistId: string): AppThunk =>
	dispatch => {
		dispatch(setAppStatusAC({ status: 'loading' }))
		todolistsAPI
			.createTask(todolistId, title)
			.then(res => {
				if (res.data.resultCode === 0) {
					const task = res.data.data.item
					const action = addTaskAC({ task })
					dispatch(action)
					dispatch(setAppStatusAC({ status: 'succeeded' }))
				} else {
					handleServerAppError(res.data, dispatch)
				}
			})
			.catch(error => {
				handleServerNetworkError(error, dispatch)
			})
	}
export const updateTaskTC =
	(
		taskId: string,
		domainModel: UpdateDomainTaskModelType,
		todolistId: string
	): AppThunk =>
	(dispatch, getState) => {
		const state = getState()
		const task = state.tasks[todolistId].find(t => t.id === taskId)
		if (!task) {
			//throw new Error("task not found in the state");
			console.warn('task not found in the state')
			return
		}

		const apiModel: UpdateTaskModelType = {
			deadline: task.deadline,
			description: task.description,
			priority: task.priority,
			startDate: task.startDate,
			title: task.title,
			status: task.status,
			...domainModel,
		}

		todolistsAPI
			.updateTask(todolistId, taskId, apiModel)
			.then(res => {
				if (res.data.resultCode === 0) {
					const action = updateTaskAC({
						taskId,
						model: domainModel,
						todolistId,
					})
					dispatch(action)
				} else {
					handleServerAppError(res.data, dispatch)
				}
			})
			.catch(error => {
				handleServerNetworkError(error, dispatch)
			})
	}

// types
export type UpdateDomainTaskModelType = {
	title?: string
	description?: string
	status?: TaskStatuses
	priority?: TaskPriorities
	startDate?: string
	deadline?: string
}
export type TasksStateType = {
	[key: string]: Array<TaskType>
}
export type TasksActionsType =
	| ReturnType<typeof removeTaskAC>
	| ReturnType<typeof addTaskAC>
	| ReturnType<typeof updateTaskAC>
	| AddTodolistActionType
	| RemoveTodolistActionType
	| SetTodolistsActionType
	| ReturnType<typeof setTasksAC>
	| ClearStateActionType
