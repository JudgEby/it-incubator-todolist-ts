import React, { useState, ChangeEvent, KeyboardEvent } from 'react'
import { TextField } from '@material-ui/core'

type EditableSpanType = {
  isDone: boolean
  title: string
  changeTitleHandler: (title: string) => void
}

const EditableSpan = ({
  isDone,
  title,
  changeTitleHandler,
}: EditableSpanType) => {
  const [editMode, setEditMode] = useState(false)
  let [inputValue, setInputValue] = useState(title)

  const toggleMode = () => {
    setEditMode(!editMode)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      toggleMode()
      changeTitleHandler(inputValue)
    }
  }

  return editMode ? (
    <TextField
      autoFocus
      value={inputValue}
      onBlur={() => {
        toggleMode()
        changeTitleHandler(inputValue)
      }}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
    />
  ) : (
    <span className={isDone ? 'isDone' : ''} onDoubleClick={toggleMode}>
      {title}
    </span>
  )
}

export default EditableSpan
