import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { FilterValuesType } from './App'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: Array<TaskType>
  todoListID: string
  removeTask: (taskId: string, todoListID: string) => void
  removeTodoList: (todoListID: string) => void
  changeTodoListFilter: (value: FilterValuesType, todoListID: string) => void
  filter: FilterValuesType
  addTask: (title: string, todoListID: string) => void
  changeTaskStatus: (id: string, todoListID: string) => void
}

export function Todolist(props: PropsType) {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<null | string>(null)

  const addTask = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      props.addTask(trimmedTitle, props.todoListID)
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

  const onClickRemoveTodolistHandler = () =>
    props.removeTodoList(props.todoListID)

  const onAllClickHandler = () =>
    props.changeTodoListFilter('all', props.todoListID)
  const onActiveClickHandler = () =>
    props.changeTodoListFilter('active', props.todoListID)
  const onCompletedClickHandler = () =>
    props.changeTodoListFilter('completed', props.todoListID)

  return (
    <div>
      <h3>
        {props.title}
        <button onClick={onClickRemoveTodolistHandler}>Del</button>
      </h3>
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
          const onClickHandler = () => props.removeTask(t.id, props.todoListID)
          const isDoneHandler = () => {
            props.changeTaskStatus(t.id, props.todoListID)
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
