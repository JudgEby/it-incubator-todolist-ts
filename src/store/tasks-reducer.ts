import { TasksStateType } from '../App'
import { v1 } from 'uuid'
import { AddTodolistAT, RemoveTodolistAT } from './todolists-reducer'

export type ActionsType =
  | RemoveTaskAT
  | AddTaskAT
  | ChangeTaskStatusAT
  | ChangeTaskTitleAT
  | AddTodolistAT
  | RemoveTodolistAT

export type RemoveTaskAT = {
  type: 'REMOVE-TASK'
  todoListID: string
  taskID: string
}
export type AddTaskAT = {
  type: 'ADD-TASK'
  title: string
  todoListID: string
}

export type ChangeTaskStatusAT = {
  type: 'CHANGE-TASK-STATUS'
  taskId: string
  todoListID: string
}

export type ChangeTaskTitleAT = {
  type: 'CHANGE-TASK-TITLE'
  taskId: string
  todoListID: string
  title: string
}

const initialState: TasksStateType = {}

export const tasksReducer = (
  tasks: TasksStateType = initialState,
  action: ActionsType
) => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      let filteredTasks = tasks[action.todoListID].filter(
        (t) => t.id !== action.taskID
      )
      return { ...tasks, [action.todoListID]: filteredTasks }
    }
    case 'ADD-TASK': {
      const newTask = { id: v1(), title: action.title, isDone: false }

      return {
        ...tasks,
        [action.todoListID]: [newTask, ...tasks[action.todoListID]],
      }
    }
    case 'CHANGE-TASK-STATUS': {
      const newTasks = tasks[action.todoListID].map((task) => {
        if (task.id === action.taskId) {
          return { ...task, isDone: !task.isDone }
        }
        return task
      })
      return { ...tasks, [action.todoListID]: newTasks }
    }
    case 'CHANGE-TASK-TITLE': {
      const newTasks = tasks[action.todoListID].map((task) => {
        if (task.id === action.taskId) {
          return { ...task, title: action.title }
        }
        return task
      })
      return { ...tasks, [action.todoListID]: newTasks }
    }
    case 'ADD-TODOLIST':
      return { ...tasks, [action.todoListID]: [] }
    case 'REMOVE-TODOLIST':
      const copyTasks = { ...tasks }
      delete copyTasks[action.todoListID]
      return copyTasks
    default:
      return tasks
  }
}

export const removeTaskAC = (
  taskID: string,
  todoListID: string
): RemoveTaskAT => {
  return { type: 'REMOVE-TASK', todoListID: todoListID, taskID: taskID }
}

export const addTaskAC = (title: string, todoListID: string): AddTaskAT => {
  return { type: 'ADD-TASK', title: title, todoListID: todoListID }
}

export const changeTaskStatusAC = (
  taskId: string,
  todoListID: string
): ChangeTaskStatusAT => {
  return { type: 'CHANGE-TASK-STATUS', taskId: taskId, todoListID: todoListID }
}

export const changeTaskTitleAC = (
  taskId: string,
  todoListID: string,
  title: string
): ChangeTaskTitleAT => {
  return {
    type: 'CHANGE-TASK-TITLE',
    taskId: taskId,
    todoListID: todoListID,
    title: title,
  }
}
