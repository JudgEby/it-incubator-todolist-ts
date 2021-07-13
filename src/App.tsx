import React, { useState } from 'react'
import './App.css'
import { TaskType, Todolist } from './Todolist'
import { v1 } from 'uuid'
import AddItemForm from './components/AddItemForm'
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListType = {
  id: string
  title: string
  filter: FilterValuesType
}

type TaskStateType = {
  [key: string]: TaskType[]
}

function App() {
  const todoListID_1 = v1()
  const todoListID_2 = v1()

  const [todoLists, setTodoLists] = useState<TodoListType[]>([
    { id: todoListID_1, title: 'What you want', filter: 'all' },
    { id: todoListID_2, title: 'What to buy', filter: 'all' },
  ])

  const [tasks, setTasks] = useState<TaskStateType>({
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
    let filteredTasks = tasks[todoListID].filter((t) => t.id !== taskId)
    setTasks({ ...tasks, [todoListID]: filteredTasks })
  }

  function addTask(title: string, todoListID: string) {
    const newTask = { id: v1(), title: title, isDone: false }
    ///let newTasks = [task, ...tasks]
    setTasks({ ...tasks, [todoListID]: [newTask, ...tasks[todoListID]] })
  }

  function changeTaskStatus(taskId: string, todoListID: string): void {
    const searchedTask = tasks[todoListID].find((task) => task.id === taskId)

    if (searchedTask) {
      searchedTask.isDone = !searchedTask.isDone
      setTasks({ ...tasks })
    }
  }

  function changeTaskTitle(
    taskId: string,
    todoListID: string,
    title: string
  ): void {
    const searchedTask = tasks[todoListID].find((task) => task.id === taskId)

    if (searchedTask) {
      searchedTask.title = title
      setTasks({ ...tasks })
    }
  }

  function changeTodoLostTitle(todoListID: string, title: string) {
    setTodoLists(
      todoLists.map((tl) => {
        if (tl.id === todoListID) {
          return { ...tl, title: title }
        }
        return tl
      })
    )
  }

  function changeTodoListFilter(value: FilterValuesType, todoListID: string) {
    setTodoLists(
      todoLists.map((tl) =>
        tl.id === todoListID ? { ...tl, filter: value } : tl
      )
    )
  }

  const addTodoList = (title: string) => {
    const id = v1()
    const newTodoList: TodoListType = { id: id, title: title, filter: 'all' }
    setTodoLists([...todoLists, newTodoList])
    setTasks({ ...tasks, [id]: [] })
  }

  const removeTodoList = (todoListID: string) => {
    setTodoLists(todoLists.filter((tl) => tl.id !== todoListID))
    delete tasks[todoListID]
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

export default App
