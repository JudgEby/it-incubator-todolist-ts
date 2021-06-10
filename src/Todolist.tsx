import React from 'react'
import { keyType } from './App'
import Button from './components/Button'
import Input from './components/Input'

type PropsType = {
  addTask: (value: string) => void
  title: string
  tasks: Array<TaskType>
  removeTasks: (id: string) => void
  changeFilter: (key: keyType) => void
}

type TaskType = {
  id: string
  title: string
  isDone: boolean
}

const Todolist = (props: PropsType) => {
  const changeFilterHandlerAll = () => props.changeFilter('All')

  const changeFilterHandlerActive = () => props.changeFilter('Active')

  const changeFilterHandlerCompleted = () => props.changeFilter('Completed')

  return (
    <div>
      <h3>{props.title}</h3>
      <Input callBack={props.addTask} />

      <ul>
        {props.tasks.map((task) => {
          const removeTaskHandler = () => props.removeTasks(task.id)

          return (
            <li key={task.id}>
              <Button callBack={removeTaskHandler} value={'x'} />
              <input key={task.id} type='checkbox' checked={task.isDone} />{' '}
              <span>{task.title}</span>
            </li>
          )
        })}
      </ul>
      <div>
        <Button callBack={changeFilterHandlerAll} value={'All'} />
        <Button callBack={changeFilterHandlerActive} value={'Active'} />
        <Button callBack={changeFilterHandlerCompleted} value={'Completed'} />
      </div>
    </div>
  )
}

export default Todolist
