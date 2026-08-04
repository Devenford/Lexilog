import { render, screen } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import WordInfo from '../MultipleChoice/WordInfo'
import helper from './helper'

const testWord = helper.testWord
const paragraphIndex = 0

const getDefinitions = (word, paragraph) => word.definitions.filter(d => d.paragraphIndices.includes(paragraph))

const getOtherDefinitions = (word, paragraph) => word.definitions.filter(d => !d.paragraphIndices.includes(paragraph))

const apiWordInfo = [
  {
    phonetics: [
      {
        text: '/kən\'vɛn.ʃən/',
        audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/convention-us.mp3'
      },
    ]
  }
]

const restHandlers  = [
  http.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${testWord.word}`, () => {
    return HttpResponse.json(apiWordInfo)
  })
]
const server = setupServer(...restHandlers )
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

test('only displays definitions associated with/for the given paragraph and all synonyms', () => {
  render(<WordInfo word={testWord} paragraph={paragraphIndex} />)

  getDefinitions(testWord, paragraphIndex)
    .forEach(d => expect(screen.getByText(d.definition)).toBeInTheDocument())

  getOtherDefinitions(testWord, paragraphIndex)
    .forEach(d => expect(screen.queryByText(d.definition)).not.toBeInTheDocument())

  testWord.synonyms
    .forEach(s => expect(screen.getByText(s)).toBeInTheDocument())
})

test('displays the phonetic pronunciation and audio', async () => {
  render(<WordInfo word={testWord} paragraph={paragraphIndex} />)

  expect(await screen.findByText(apiWordInfo[0].phonetics[0].text)).toBeInTheDocument()

  const audio = screen.getByTestId('Pronunciation Audio')
  expect(audio).toHaveAttribute('src', apiWordInfo[0].phonetics[0].audio)
})

afterAll(() => server.close())
afterEach(() => server.resetHandlers())