import React, { useCallback } from 'react'
import { Checkbox, IconButton } from '@material-ui/core'
import EditableSpan from './EditableSpan'
import { Delete } from '@material-ui/icons'

type TaskPropsType = {
  task: { id: string; isDone: boolean; title: string }
  todoListId: string
  isDoneHandler: (todoListId: string, taskId: string) => void
  changeTaskTitleHandler: (
    todoListId: string,
    taskId: string,
    title: string
  ) => void
  onClickRemoveTaskHandler: (todoListId: string, taskId: string) => void
}

const Task = React.memo((props: TaskPropsType) => {
  const {
    task: { id, isDone, title },
    todoListId,
    isDoneHandler,
    changeTaskTitleHandler,
    onClickRemoveTaskHandler,
  } = props

  const changeTitleHandler = useCallback(
    (title: string) => changeTaskTitleHandler(id, todoListId, title),
    []
  )

  return (
    <li key={id}>
      <Checkbox
        checked={isDone}
        onChange={() => isDoneHandler(id, todoListId)}
        size={'small'}
        color={'primary'}
      />
      <EditableSpan
        isDone={isDone}
        title={title}
        changeTitleHandler={changeTitleHandler}
      />
      <IconButton
        onClick={() => onClickRemoveTaskHandler(id, todoListId)}
        color={'primary'}
        size={'small'}
      >
        <Delete />
      </IconButton>
    </li>
  )
})

export default Task
