import React from 'react'
import './App.css'
import { TaskType, Todolist } from './Todolist'
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
} from './store/todolists-reducer'
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from './store/tasks-reducer'
import { useDispatch, useSelector } from 'react-redux'
import { AppRootStateType } from './store/store'

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type TasksStateType = {
  [key: string]: TaskType[]
}

function AppWithRedux() {
  const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(
    (state) => state.todolists
  )
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  )
  const dispatch = useDispatch()

  function removeTask(taskId: string, todoListID: string) {
    const action = removeTaskAC(taskId, todoListID)
    dispatch(action)
  }

  function addTask(title: string, todoListID: string) {
    const action = addTaskAC(title, todoListID)
    dispatch(action)
  }

  function changeTaskStatus(taskId: string, todoListID: string): void {
    const action = changeTaskStatusAC(taskId, todoListID)
    dispatch(action)
  }

  function changeTaskTitle(
    taskId: string,
    todoListID: string,
    title: string
  ): void {
    const action = changeTaskTitleAC(taskId, todoListID, title)
    dispatch(action)
  }

  function changeTodoLostTitle(todoListID: string, title: string) {
    const action = ChangeTodoListTitleAC(todoListID, title)
    dispatch(action)
  }

  function changeTodoListFilter(value: FilterValuesType, todoListID: string) {
    const action = ChangeTodoListFilterAC(todoListID, value)
    dispatch(action)
  }

  const addTodoList = (title: string) => {
    const action = AddTodoListAC(title)
    dispatch(action)
  }

  const removeTodoList = (todoListID: string) => {
    const action = RemoveTodoListAC(todoListID)
    dispatch(action)
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

export default AppWithRedux
