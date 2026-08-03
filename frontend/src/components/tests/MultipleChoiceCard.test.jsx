import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MultipleChoiceCard from '../MultipleChoice/MultipleChoiceCard'
import helper from './helper'
import { test } from 'vitest'

const testWord = helper.testWord
const wrongOption = testWord.options.find(o => o !== testWord.word)
const curr = 0 // zero-indexed questions
const numQuestions = 10

test('renders the question number, paragraph, and all 4 options', () => {
  render(<MultipleChoiceCard
    word={testWord}
    curr={curr}
    numQuestions={numQuestions}
  />)

  expect(screen.getByText(`Question ${curr+1}`)).toBeInTheDocument()

  const renderedParagraph = testWord.paragraphs.some(p => screen.queryByText(p))
  expect(renderedParagraph).toBe(true)

  testWord.options.forEach(o => expect(screen.getByText(o)).toBeInTheDocument())
})

test('Next button is only displayed after the correct option has been selected', async () => {
  const setCurr = vi.fn()
  const setResults = vi.fn()

  render(<MultipleChoiceCard
    word={testWord}
    curr={curr}
    setCurr={setCurr}
    setResults={setResults}
    numQuestions={numQuestions}
  />)

  // Next button is absent before any option is clicked
  expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()

  // Next button is absent after an incorrect option is clicked
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: wrongOption }))
  expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()

  // Next button is present after the correct option is clicked
  await user.click(screen.getByRole('button', { name: testWord.word }))
  expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
})

test('updates the results and advances to the next question when the Next button is clicked', async () => {
  const setCurr = vi.fn()
  const setResults = vi.fn()

  render(<MultipleChoiceCard
    word={testWord}
    curr={curr}
    setCurr={setCurr}
    setResults={setResults}
    numQuestions={numQuestions}
  />)

  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: testWord.word }))
  await user.click(screen.getByRole('button', { name: 'Next' }))

  expect(setCurr).toHaveBeenCalledTimes(1)
  const currUpdaterFn = setCurr.mock.calls[0][0]
  expect(currUpdaterFn(0)).toBe(1)

  expect(setResults).toHaveBeenCalledTimes(1)
  const resultUpdaterFn = setResults.mock.calls[0][0]
  expect(resultUpdaterFn([])).toEqual([{
    id: testWord.id,
    tries: 1
  }])
})