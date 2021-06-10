import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

type InputPT = {
  callBack: (value: string) => void
}

const Input = ({ callBack }: InputPT) => {
  let [value, setValue] = useState('')

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
  }

  const onClickHandler = () => {
    callBack(value)
    setValue('')
  }

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClickHandler()
    }
  }

  return (
    <div>
      <input
        type='text'
        onChange={onChangeHandler}
        value={value}
        onKeyPress={onKeyPressHandler}
      />
      <button onClick={onClickHandler}>+</button>
    </div>
  )
}

export default Input
