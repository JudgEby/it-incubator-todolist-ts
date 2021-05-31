import React, { useState } from 'react'
import './App.css'
import Todolist from './Todolist'

export type keyType = 'All' | 'Active' | 'Completed'

function App() {
  let [task1, setTask1] = useState([
    { id: 1, title: 'HTML&CSS', isDone: true },
    { id: 2, title: 'JS', isDone: true },
    { id: 3, title: 'ReactJS', isDone: false },
  ])

  let [filter, setFilter] = useState<keyType>('All')

  let filterValue = task1

  if (filter === 'Active') {
    filterValue = filterValue.filter((task) => !task.isDone)
  }
  if (filter === 'Completed') {
    filterValue = filterValue.filter((task) => task.isDone)
  }

  const removeTasks = (id: number) => {
    setTask1((task1) => task1.filter((task) => task.id !== id))
  }

  const changeFilter = (key: keyType) => {
    setFilter(key)
  }

  return (
    <div className='App'>
      <Todolist
        title={'What to learn'}
        tasks={filterValue}
        removeTasks={removeTasks}
        changeFilter={changeFilter}
      />
    </div>
  )
}

export default App
