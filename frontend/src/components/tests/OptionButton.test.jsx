import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OptionButton from '../MultipleChoice/OptionButton'
import helper from './helper'

const testWord = helper.testWord
const wrongOption = testWord.options.find(o => o !== testWord.word)

test('renders the option text', () => {
  render(<OptionButton option={testWord.options[0]} />)

  expect(screen.getByText(testWord.options[0])).toBeInTheDocument()
})

test('setCompleted is called when the right answer is chosen, and setTries is updated', async () => {
  const setTries = vi.fn()
  const setCompleted = vi.fn()

  render(<OptionButton option={testWord.word} answer={testWord.word} setTries={setTries} completed={false} setCompleted={setCompleted} />)

  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: testWord.word }))

  expect(setTries).toHaveBeenCalledTimes(1)
  const triesUpdaterFn = setTries.mock.calls[0][0]
  expect(triesUpdaterFn(0)).toBe(1)
  // triesUpdaterfn is the fn t => t + 1 passed in as parameter to setTries
  expect(setCompleted).toHaveBeenCalledTimes(1)

  // clicking the right answer again does nothing
  await user.click(screen.getByRole('button', { name: testWord.word }))
  expect(setTries).toHaveBeenCalledTimes(1)
  expect(setCompleted).toHaveBeenCalledTimes(1)
})

test('setCompleted is not called when the wrong answer is chosen, and setTries is updated', async () => {
  const setTries = vi.fn()
  const setCompleted = vi.fn()

  render(<OptionButton option={wrongOption} answer={testWord.word} setTries={setTries} completed={false} setCompleted={setCompleted} />)

  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: wrongOption }))

  expect(setTries).toHaveBeenCalledTimes(1)
  const triesUpdaterFn = setTries.mock.calls[0][0]
  expect(triesUpdaterFn(0)).toBe(1)
  expect(setCompleted).toHaveBeenCalledTimes(0)

  // clicking the wrong answer again does nothing
  await user.click(screen.getByRole('button', { name: wrongOption }))
  expect(setTries).toHaveBeenCalledTimes(1)
  expect(setCompleted).toHaveBeenCalledTimes(0)
})

test('does nothing when completed is already true', async () => {
  const setTries = vi.fn()
  const setCompleted = vi.fn()

  render(<OptionButton option={testWord.word} answer={testWord.word} setTries={setTries} completed={true} setCompleted={setCompleted} />)

  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: testWord.word }))

  expect(setTries).toHaveBeenCalledTimes(0)
  expect(setCompleted).toHaveBeenCalledTimes(0)
})