import React from 'react'
import { FilterValuesType } from './App'
import AddItemForm from './components/AddItemForm'
import EditableSpan from './components/EditableSpan'
import { Button, IconButton, Checkbox } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

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
          isDone={false}
          title={props.title}
          changeTitleHandler={changeTodoLostTitleHandler}
        />
        <IconButton
          onClick={onClickRemoveTodolistHandler}
          color={'primary'}
          size={'small'}
        >
          <Delete />
        </IconButton>
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
            <li key={t.id}>
              <Checkbox
                checked={t.isDone}
                onChange={isDoneHandler}
                size={'small'}
                color={'primary'}
              />
              <EditableSpan
                isDone={t.isDone}
                title={t.title}
                changeTitleHandler={changeTaskTitleHandler}
              />
              <IconButton
                onClick={onClickHandler}
                color={'primary'}
                size={'small'}
              >
                <Delete />
              </IconButton>
            </li>
          )
        })}
      </ul>
      <div>
        <Button
          size={'small'}
          variant={'contained'}
          color={props.filter === 'all' ? 'secondary' : 'primary'}
          // className={props.filter === 'all' ? 'activeFilter' : ''}
          onClick={onAllClickHandler}
        >
          All
        </Button>
        <Button
          style={{ margin: '0 3px' }}
          size={'small'}
          variant={'contained'}
          color={props.filter === 'active' ? 'secondary' : 'primary'}
          // className={props.filter === 'active' ? 'activeFilter' : ''}
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          size={'small'}
          variant={'contained'}
          color={props.filter === 'completed' ? 'secondary' : 'primary'}
          // className={props.filter === 'completed' ? 'activeFilter' : ''}
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </div>
    </div>
  )
}
