import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AddItemForm from './AddItemForm'
import { action } from '@storybook/addon-actions'

export default {
  title: 'TODOLIST/AddItemForm',
  component: AddItemForm,
} as ComponentMeta<typeof AddItemForm>

//@ts-ignore
const Template: ComponentStory<typeof AddItemForm> = (args) => (
  <AddItemForm {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  addItem: action('Lalala'),
}
