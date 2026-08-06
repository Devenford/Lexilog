import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MultipleChoice from '../MultipleChoice/MultipleChoice'
import helper from './helper'
import { test } from 'vitest'

const restHandlers  = [
  http.get('/api/practice/multiple-choice', () => {
    return HttpResponse.json(helper.testQuiz)
  }),
  http.post('/api/practice/multiple-choice', () => {
    return HttpResponse.json(helper.testScore)
  })
]
const server = setupServer(...restHandlers )
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// mock the MultipleChoiceCard component (fn) and simulate quiz completion
vi.mock('../MultipleChoice/MultipleChoiceCard', () => ({
  default : ({ setCurr, setResults }) => {
    const handleClick = () => {
      setResults(helper.testResults)
      setCurr(10)
    }

    return (
      <button onClick={handleClick}>
          Complete Quiz
      </button>
    )}
}))

test('displays loading state while fetching quiz', () => {
  server.use(
    http.get('/api/practice/multiple-choice', async () => {
      await new Promise((resolve) => { setTimeout(resolve, 100)})
      return HttpResponse.json(helper.testQuiz)
    })
  )
  const route = '/practice/multiplechoice'

  render(
    <MemoryRouter initialEntries={[route]}>
      <MultipleChoice />
    </MemoryRouter>
  )

  expect(screen.getByText('Loading quiz...')).toBeInTheDocument()
})

test('displays calculating results while submitting the quiz', async () => {
  let testUser = { ...helper.testUser }
  const setUser = vi.fn().mockImplementation((updaterFn) => {
    testUser = updaterFn(testUser)
  })
  server.use(
    http.post('/api/practice/multiple-choice', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return HttpResponse.json(helper.testScore)
    })
  )
  const route = '/practice/multiplechoice'

  render(
    <MemoryRouter initialEntries={[route]}>
      <MultipleChoice setUser={setUser} />
    </MemoryRouter>
  )

  const user = userEvent.setup()
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Complete Quiz' })).toBeInTheDocument()
  })
  await user.click(screen.getByRole('button', { name: 'Complete Quiz' }))
  expect(screen.getByText('Calculating results...')).toBeInTheDocument()
})

test('updates user\'s state on quiz completion', async () => {
  let testUser = { ...helper.testUser }
  const setUser = vi.fn().mockImplementation((updaterFn) => {
    testUser = updaterFn(testUser)
  })
  const route = '/practice/multiplechoice'

  render(
    <MemoryRouter initialEntries={[route]}>
      <MultipleChoice setUser={setUser} />
    </MemoryRouter>
  )

  const user = userEvent.setup()
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Complete Quiz' })).toBeInTheDocument()
  })
  await user.click(screen.getByRole('button', { name: 'Complete Quiz' }))

  await waitFor(() => {
    expect(testUser).toEqual({
      username: 'Bob1234',
      coins: 20,
      xp: 60,
      monthlyXp: 60,
      currentStreak: 1,
      longestStreak: 1,
      id: '6a67d27e615449abc179d123',
    })

    expect(screen.getByText(`You got ${helper.testScore.numCorrect} out of 10 correct!`)).toBeVisible()
    expect(screen.getByText(`Coins: + ${helper.testScore.coinsGained}`)).toBeVisible()
    expect(screen.getByText(`XP: + ${helper.testScore.xpGained}`)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Return to Practice' })).toBeInTheDocument()
  })
})

afterAll(() => server.close())
afterEach(() => server.resetHandlers())