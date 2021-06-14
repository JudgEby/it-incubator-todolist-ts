import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { FilterValuesType } from './App'

type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (taskId: string) => void
  changeFilter: (value: FilterValuesType) => void
  addTask: (title: string) => void
  changeStatus: (id: string) => void
  filter: FilterValuesType
}

export function Todolist(props: PropsType) {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<null | string>(null)

  const addTask = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      props.addTask(trimmedTitle)
      setError(null)
    } else {
      setError('Title is required')
    }
    setTitle('')
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null)
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const onAllClickHandler = () => props.changeFilter('all')
  const onActiveClickHandler = () => props.changeFilter('active')
  const onCompletedClickHandler = () => props.changeFilter('completed')

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          className={error ? 'error' : ''}
          value={title}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
        />
        <button onClick={addTask}>+</button>
        {error && <div className={'errorMessage'}>{error}</div>}
      </div>
      <ul>
        {props.tasks.map((t) => {
          const onClickHandler = () => props.removeTask(t.id)
          const isDoneHandler = () => {
            props.changeStatus(t.id)
          }
          return (
            <li key={t.id}>
              <input
                type='checkbox'
                checked={t.isDone}
                onChange={isDoneHandler}
              />
              <span className={t.isDone ? 'isDone' : ''}>{t.title}</span>
              <button onClick={onClickHandler}>x</button>
            </li>
          )
        })}
      </ul>
      <div>
        <button
          className={props.filter === 'all' ? 'activeFilter' : ''}
          onClick={onAllClickHandler}
        >
          All
        </button>
        <button
          className={props.filter === 'active' ? 'activeFilter' : ''}
          onClick={onActiveClickHandler}
        >
          Active
        </button>
        <button
          className={props.filter === 'completed' ? 'activeFilter' : ''}
          onClick={onCompletedClickHandler}
        >
          Completed
        </button>
      </div>
    </div>
  )
}
