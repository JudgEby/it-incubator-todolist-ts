import React, { useReducer } from 'react'
import './App.css'
import { TaskType, Todolist } from './Todolist'
import { v1 } from 'uuid'
import AddItemForm from './components/AddItemForm'
import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import {
  AddTodoListAC,
  ChangeTodoListFilterAC,
  ChangeTodoListTitleAC,
  RemoveTodoListAC,
  todoListsReducer,
} from './store/todolists-reducer'
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from './store/tasks-reducer'

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type TasksStateType = {
  [key: string]: TaskType[]
}

function AppWithReducer() {
  const todoListID_1 = v1()
  const todoListID_2 = v1()

  const [todoLists, dispatchToTodolist] = useReducer(todoListsReducer, [
    { id: todoListID_1, title: 'What you want', filter: 'all' },
    { id: todoListID_2, title: 'What to buy', filter: 'all' },
  ])

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todoListID_1]: [
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'ReactJS', isDone: false },
      { id: v1(), title: 'Rest API', isDone: false },
      { id: v1(), title: 'GraphQL', isDone: false },
    ],
    [todoListID_2]: [
      { id: v1(), title: 'Books', isDone: true },
      { id: v1(), title: 'NoteBook', isDone: false },
      { id: v1(), title: 'Car', isDone: false },
      { id: v1(), title: 'PC', isDone: false },
    ],
  })

  function removeTask(taskId: string, todoListID: string) {
    const action = removeTaskAC(taskId, todoListID)
    dispatchToTasks(action)
  }

  function addTask(title: string, todoListID: string) {
    const action = addTaskAC(title, todoListID)
    dispatchToTasks(action)
  }

  function changeTaskStatus(taskId: string, todoListID: string): void {
    const action = changeTaskStatusAC(taskId, todoListID)
    dispatchToTasks(action)
  }

  function changeTaskTitle(
    taskId: string,
    todoListID: string,
    title: string
  ): void {
    const action = changeTaskTitleAC(taskId, todoListID, title)
    dispatchToTasks(action)
  }

  function changeTodoLostTitle(todoListID: string, title: string) {
    const action = ChangeTodoListTitleAC(todoListID, title)
    dispatchToTodolist(action)
  }

  function changeTodoListFilter(value: FilterValuesType, todoListID: string) {
    const action = ChangeTodoListFilterAC(todoListID, value)
    dispatchToTodolist(action)
  }

  const addTodoList = (title: string) => {
    const action = AddTodoListAC(title)
    dispatchToTodolist(action)
    dispatchToTasks(action)
  }

  const removeTodoList = (todoListID: string) => {
    const action = RemoveTodoListAC(todoListID)
    dispatchToTodolist(action)
    dispatchToTasks(action)
  }

  const todoListsComponents = todoLists.map((tl) => {
    let tasksForTodolist = tasks[tl.id]

    if (tl.filter === 'active') {
      tasksForTodolist = tasks[tl.id].filter((t) => t.isDone === false)
    }
    if (tl.filter === 'completed') {
      tasksForTodolist = tasks[tl.id].filter((t) => t.isDone === true)
    }

    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: '20px' }} elevation={2}>
          <Todolist
            todoListID={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            removeTask={removeTask}
            changeTodoListFilter={changeTodoListFilter}
            addTask={addTask}
            changeTaskStatus={changeTaskStatus}
            changeTaskTitle={changeTaskTitle}
            filter={tl.filter}
            removeTodoList={removeTodoList}
            changeTodoLostTitleHandler={changeTodoLostTitle}
          />
        </Paper>
      </Grid>
    )
  })

  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <Menu />
          </IconButton>
          <Typography variant='h6'>TodoLists</Typography>
          <Button color='inherit'>Menu</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: '20px 0', justifyContent: 'center' }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container spacing={1}>
          {todoListsComponents}
        </Grid>
      </Container>
      <p>Hi</p>
    </div>
  )
}

export default AppWithReducer
