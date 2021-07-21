import { FilterValuesType, TodoListType } from '../App'
import { v1 } from 'uuid'

export type ActionsType =
  | RemoveTodolistAT
  | AddTodolistAT
  | ChangeTodoLostTitleAT
  | ChangeTodoListFilterAT

export type RemoveTodolistAT = {
  type: 'REMOVE-TODOLIST'
  todoListID: string
}
export type AddTodolistAT = {
  type: 'ADD-TODOLIST'
  title: string
  todoListID: string
}

export type ChangeTodoLostTitleAT = {
  type: 'CHANGE-TODOLIST-TITLE'
  todoListID: string
  title: string
}

export type ChangeTodoListFilterAT = {
  type: 'CHANGE-TODOLIST-FILTER'
  value: FilterValuesType
  todoListID: string
}

export const todoListsReducer = (
  todoLists: TodoListType[],
  action: ActionsType
) => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return todoLists.filter((tl) => tl.id !== action.todoListID)
    case 'ADD-TODOLIST':
      const newTodoList: TodoListType = {
        id: action.todoListID,
        title: action.title,
        filter: 'all',
      }
      return [...todoLists, newTodoList]
    case 'CHANGE-TODOLIST-TITLE':
      return todoLists.map((tl) =>
        tl.id === action.todoListID ? { ...tl, title: action.title } : tl
      )
    case 'CHANGE-TODOLIST-FILTER':
      return todoLists.map((tl) =>
        tl.id === action.todoListID ? { ...tl, filter: action.value } : tl
      )
    default:
      return todoLists
  }
}

export const RemoveTodoListAC = (todoListID: string): RemoveTodolistAT => {
  return { type: 'REMOVE-TODOLIST', todoListID: todoListID }
}

export const AddTodoListAC = (title: string): AddTodolistAT => {
  return { type: 'ADD-TODOLIST', title: title, todoListID: v1() }
}

export const ChangeTodoListTitleAC = (
  todoListID: string,
  title: string
): ChangeTodoLostTitleAT => {
  return { type: 'CHANGE-TODOLIST-TITLE', todoListID: todoListID, title: title }
}

export const ChangeTodoListFilterAC = (
  todoListID: string,
  value: FilterValuesType
): ChangeTodoListFilterAT => {
  return {
    type: 'CHANGE-TODOLIST-FILTER',
    todoListID: todoListID,
    value: value,
  }
}
