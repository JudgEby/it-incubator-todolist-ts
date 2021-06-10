import React, { useState } from 'react'
import './App.css'
import Todolist from './Todolist'
import { v1 } from 'uuid'

export type keyType = 'All' | 'Active' | 'Completed'

function App() {
  let [task, setTask] = useState([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'ReactJS', isDone: false },
  ])

  let [filter, setFilter] = useState<keyType>('All')

  let filterValue = task

  if (filter === 'Active') {
    filterValue = filterValue.filter((task) => !task.isDone)
  }
  if (filter === 'Completed') {
    filterValue = filterValue.filter((task) => task.isDone)
  }

  const addTask = (value: string) => {
    let newTask = { id: v1(), title: value, isDone: false }
    setTask([newTask, ...task])
  }

  const removeTasks = (id: string) => {
    setTask((task1) => task1.filter((task) => task.id !== id))
  }

  const changeFilter = (key: keyType) => {
    setFilter(key)
  }

  return (
    <div className='App'>
      <Todolist
        addTask={addTask}
        title={'What to learn'}
        tasks={filterValue}
        removeTasks={removeTasks}
        changeFilter={changeFilter}
      />
    </div>
  )
}

export default App
