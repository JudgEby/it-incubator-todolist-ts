import React from 'react'

type ButtonPT = {
  callBack: () => void
  value: string
}

const Button = ({ callBack, value }: ButtonPT) => {
  const onClickHandler = () => callBack()

  return <button onClick={onClickHandler}>{value}</button>
}

export default Button
