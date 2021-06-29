import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

type AddItemFormPT = {
  addItem: (value: string) => void
}

const AddItemForm = ({ addItem }: AddItemFormPT) => {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<null | string>(null)

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addItemLocal()
    }
  }

  const addItemLocal = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      addItem(trimmedTitle)
      setError(null)
    } else {
      setError('Title is required')
    }
    setTitle('')
  }

  return (
    <div>
      <input
        className={error ? 'error' : ''}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
      />
      <button onClick={addItemLocal}>+</button>
      {error && <div className={'errorMessage'}>{error}</div>}
    </div>
  )
}

export default AddItemForm
