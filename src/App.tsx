import React, { useState } from 'react'
import './App.css'
import { TaskType, Todolist } from './Todolist'
import { v1 } from 'uuid'

export type FilterValuesType = 'all' | 'active' | 'completed'

type TodoListType = {
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

  function changeTodoListFilter(value: FilterValuesType, todoListID: string) {
    setTodoLists(
      todoLists.map((tl) =>
        tl.id === todoListID ? { ...tl, filter: value } : tl
      )
    )
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
      <Todolist
        key={v1()}
        todoListID={tl.id}
        title={tl.title}
        tasks={tasksForTodolist}
        removeTask={removeTask}
        changeTodoListFilter={changeTodoListFilter}
        addTask={addTask}
        changeTaskStatus={changeTaskStatus}
        filter={tl.filter}
        removeTodoList={removeTodoList}
      />
    )
  })

  return <div className='App'>{todoListsComponents}</div>
}

export default App
