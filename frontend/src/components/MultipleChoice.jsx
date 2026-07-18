import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import helper from './helper'
import MultipleChoiceButtons from './MultipleChoiceButtons'
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

const MultipleChoice = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [curr, setCurr] = useState(0)
  const [numTries, setNumTries] = useState(0)

  const words = helper.words
  const getRandomIndex = () => Math.floor(Math.random() * 3) // 3 = no. of paragraphs

  const options = words[curr].options
  //Fisher-Yates shuffle:
  for (let i=options.length-1; i>0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
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
          {words[curr].paragraphs[getRandomIndex()]}
        </CardContent>
        <MultipleChoiceButtons words={words} curr={curr} options={options} setNumTries={setNumTries} />
        <CardFooter className='flex flex-col gap-2'>
          <Button variant='outline' className='w-50 h-10 text-sm border-2 hover:bg-gray-100 hover:text-inherit'>
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default MultipleChoice