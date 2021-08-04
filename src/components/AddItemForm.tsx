import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { AddBox } from '@material-ui/icons'
import { IconButton, TextField } from '@material-ui/core'

type AddItemFormPT = {
  addItem: (value: string) => void
}

const AddItemForm = React.memo(({ addItem }: AddItemFormPT) => {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<null | string>(null)

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) setError(null)
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
      <TextField
        variant={'outlined'}
        autoFocus
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        error={!!error}
        helperText={error && 'Title is missing'}
      />
      <IconButton onClick={addItemLocal} color={'primary'} size={'small'}>
        <AddBox />
      </IconButton>
    </div>
  )
})

export default AddItemForm
