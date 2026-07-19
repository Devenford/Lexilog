import { useState } from 'react'
import OptionButton from './OptionButton'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const shuffle = (originalArray) => {
  const shuffledArray = [...originalArray]  // do not mutate the original array (paragraphs array in each word object)
  //Fisher-Yates shuffle:
  for (let i=shuffledArray.length-1; i>0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}

const MultipleChoiceCard = ({ word, curr, setCurr, setResults }) => {
  const [tries, setTries] = useState(0)
  const [paragraph] = useState(Math.floor(Math.random() * 3)) // 3 = no. of paragraphs
  const [options] = useState(shuffle(word.options))
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    setResults(currentResults => [...currentResults, {
      word: word.word,
      id: word.id,
      tries: tries
    }])
    setCurr(c => c + 1)
  }

  return (
    <div className='flex justify-center'>
      <Card className='flex flex-col gap-4 px-4 py-8 mx-8 w-xl'>
        <CardHeader>
          <CardTitle className='text-lg text-center'>
            Question {`${curr+1}`}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 text-base'>
          {word.paragraphs[paragraph]}
        </CardContent>
        <CardContent className='grid grid-cols-2 grid-rows-2 gap-2'>
          <OptionButton option={options[0]} answer={word.word} setTries={setTries} completed={completed} setCompleted={setCompleted} />
          <OptionButton option={options[1]} answer={word.word} setTries={setTries} completed={completed} setCompleted={setCompleted} />
          <OptionButton option={options[2]} answer={word.word} setTries={setTries} completed={completed} setCompleted={setCompleted} />
          <OptionButton option={options[3]} answer={word.word} setTries={setTries} completed={completed} setCompleted={setCompleted} />
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          {completed &&
            <Button onClick={handleNext} variant='outline' className='w-50 h-10 text-sm border-2 hover:bg-gray-100 hover:text-inherit'>
            Next
            </Button>
          }
        </CardFooter>
      </Card>
    </div>
  )
}

export default MultipleChoiceCard