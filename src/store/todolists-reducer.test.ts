import {
  AddTodoListAC,
  ChangeTodoListFilterAC,
  ChangeTodoListFilterAT,
  ChangeTodoListTitleAC,
  ChangeTodoLostTitleAT,
  RemoveTodoListAC,
  todoListsReducer,
} from './todolists-reducer'
import { v1 } from 'uuid'
import { FilterValuesType, TodoListType } from '../App'

let todolistId1: string
let todolistId2: string
let newTodolistTitle: string
let startState: Array<TodoListType>

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  newTodolistTitle = 'New Todolist'
  startState = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ]
})

test('correct todolist should be removed', () => {
  const endState = todoListsReducer(startState, RemoveTodoListAC(todolistId1))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  const endState = todoListsReducer(startState, AddTodoListAC(newTodolistTitle))

  expect(endState.length).toBe(3)
  expect(endState[2].title).toBe(newTodolistTitle)
})

test('correct todolist should change its name', () => {
  const action: ChangeTodoLostTitleAT = ChangeTodoListTitleAC(
    todolistId2,
    newTodolistTitle
  )

  const endState = todoListsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'

  const action: ChangeTodoListFilterAT = ChangeTodoListFilterAC(
    todolistId2,
    newFilter
  )

  const endState = todoListsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})
