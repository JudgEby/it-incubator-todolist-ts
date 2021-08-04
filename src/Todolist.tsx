import React, { useCallback } from 'react'
import { FilterValuesType } from './App'
import AddItemForm from './components/AddItemForm'
import EditableSpan from './components/EditableSpan'
import { Button, IconButton, Checkbox } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import Task from './components/Task'

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

export const Todolist = React.memo((props: PropsType) => {
  console.log('Todolist')
  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.todoListID)
    },
    [props.addTask, props.todoListID]
  )

  const onClickRemoveTodolistHandler = useCallback(
    () => props.removeTodoList(props.todoListID),
    [props.removeTodoList, props.todoListID]
  )

  const onAllClickHandler = useCallback(
    () => props.changeTodoListFilter('all', props.todoListID),
    [props.changeTodoListFilter, props.todoListID]
  )

  const onActiveClickHandler = useCallback(
    () => props.changeTodoListFilter('active', props.todoListID),
    [props.changeTodoListFilter, props.todoListID]
  )

  const onCompletedClickHandler = useCallback(
    () => props.changeTodoListFilter('completed', props.todoListID),
    [props.changeTodoListFilter, props.todoListID]
  )

  const changeTodoLostTitleHandler = useCallback(
    (title: string) => {
      props.changeTodoLostTitleHandler(props.todoListID, title)
    },
    [props.changeTodoLostTitleHandler, props.todoListID]
  )

  let tasksForTodolist = props.tasks

  if (props.filter === 'active') {
    tasksForTodolist = props.tasks.filter((t) => t.isDone === false)
  }
  if (props.filter === 'completed') {
    tasksForTodolist = props.tasks.filter((t) => t.isDone === true)
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
        {tasksForTodolist &&
          tasksForTodolist.map((t) => {
            return (
              <Task
                key={t.id}
                task={t}
                todoListId={props.todoListID}
                isDoneHandler={props.changeTaskStatus}
                changeTaskTitleHandler={props.changeTaskTitle}
                onClickRemoveTaskHandler={props.removeTask}
              />
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
})
