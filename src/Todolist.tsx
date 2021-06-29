import React from 'react'
import { FilterValuesType } from './App'
import AddItemForm from './components/AddItemForm'
import EditableSpan from './components/EditableSpan'

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
  changeTaskTitle: (taskId: string, todoListID: string, title: string) => void
  changeTodoLostTitleHandler: (todoListID: string, title: string) => void
}

export function Todolist(props: PropsType) {
  const addTask = (title: string) => {
    props.addTask(title, props.todoListID)
  }

  const onClickRemoveTodolistHandler = () =>
    props.removeTodoList(props.todoListID)

  const onAllClickHandler = () =>
    props.changeTodoListFilter('all', props.todoListID)
  const onActiveClickHandler = () =>
    props.changeTodoListFilter('active', props.todoListID)
  const onCompletedClickHandler = () =>
    props.changeTodoListFilter('completed', props.todoListID)
  const changeTodoLostTitleHandler = (title: string) => {
    props.changeTodoLostTitleHandler(props.todoListID, title)
  }

  return (
    <div>
      <h3>
        <EditableSpan
          title={props.title}
          changeTitleHandler={changeTodoLostTitleHandler}
        />
        <button onClick={onClickRemoveTodolistHandler}>Del</button>
      </h3>
      <AddItemForm addItem={addTask} />

      <ul>
        {props.tasks.map((t) => {
          const onClickHandler = () => props.removeTask(t.id, props.todoListID)
          const isDoneHandler = () => {
            props.changeTaskStatus(t.id, props.todoListID)
          }

          const changeTaskTitleHandler = (title: string) => {
            props.changeTaskTitle(t.id, props.todoListID, title)
          }
          return (
            <li className={t.isDone ? 'isDone' : ''} key={t.id}>
              <input
                type='checkbox'
                checked={t.isDone}
                onChange={isDoneHandler}
              />
              <EditableSpan
                title={t.title}
                changeTitleHandler={changeTaskTitleHandler}
              />
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
