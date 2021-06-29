import React, { useState, ChangeEvent, KeyboardEvent } from 'react'

type EditableSpanType = {
  title: string
  changeTitleHandler: (title: string) => void
}

const EditableSpan = ({ title, changeTitleHandler }: EditableSpanType) => {
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
    <input
      type='text'
      value={inputValue}
      onBlur={() => {
        toggleMode()
        changeTitleHandler(inputValue)
      }}
      autoFocus={true}
      onChange={(e) => onChangeHandler(e)}
      onKeyDown={(e) => onKeyDownHandler(e)}
    />
  ) : (
    <span onDoubleClick={toggleMode}>{title}</span>
  )
}

export default EditableSpan
