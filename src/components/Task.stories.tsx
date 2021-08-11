import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Task from './Task'

const isDoneHandler = action('Change task status')
const changeTaskTitleHandler = action('Change task title')
const onClickRemoveTaskHandler = action('Delete task')

export default {
  title: 'TODOLIST/Task',
  component: Task,
  args: { isDoneHandler, changeTaskTitleHandler, onClickRemoveTaskHandler },
} as ComponentMeta<typeof Task>

//@ts-ignore
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />

export const TaskIsDone = Template.bind({})
TaskIsDone.args = {
  task: { id: 'id1', isDone: true, title: 'Redux' },
  todoListId: 'todolistId1',
}

export const TaskIsNotDone = Template.bind({})
TaskIsNotDone.args = {
  task: { id: 'id1', isDone: false, title: 'Redux' },
  todoListId: 'todolistId1',
}
