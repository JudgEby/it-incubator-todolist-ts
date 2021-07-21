import { TasksStateType, TodoListType } from '../App'
import { AddTodoListAC, todoListsReducer } from './todolists-reducer'
import { tasksReducer } from './tasks-reducer'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodoListType> = []

  const action = AddTodoListAC('new todolist')

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todoListsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.todoListID)
  expect(idFromTodolists).toBe(action.todoListID)
})
