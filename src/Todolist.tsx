import React from 'react'
import { keyType } from './App'

type PropsType = {
  title: string
  tasks: Array<TaskType>
  removeTasks: (id: number) => void
  changeFilter: (key: keyType) => void
}

type TaskType = {
  id: number
  title: string
  isDone: boolean
}

const Todolist = (props: PropsType) => {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>
        {props.tasks.map((task) => (
          <li key={task.id}>
            <button onClick={() => props.removeTasks(task.id)}>x</button>
            <input key={task.id} type='checkbox' checked={task.isDone} />{' '}
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => props.changeFilter('All')}>All</button>
        <button onClick={() => props.changeFilter('Active')}>Active</button>
        <button onClick={() => props.changeFilter('Completed')}>
          Completed
        </button>
      </div>
    </div>
  )
}

export default Todolist
