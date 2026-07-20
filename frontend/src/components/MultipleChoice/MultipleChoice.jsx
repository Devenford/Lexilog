import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMultipleChoiceWords, sendMultipleChoiceResults } from '../../services/practice'
import MultipleChoiceCard from './MultipleChoiceCard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const MultipleChoice = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [words, setWords] = useState([])
  const [curr, setCurr] = useState(0)   // current word index in words array

  useEffect(() => {
    setWords(getMultipleChoiceWords())
  }, [])

  const numRight = () => results.reduce((sum, r) => r.tries === 1 ? sum + 1 : sum, 0)
  const sendResults = async () => {
    return await sendMultipleChoiceResults(results)
  }

  if (curr === words.length) {
    const result = sendResults()

    return (
      <div className='flex justify-center'>
        <Card className='flex flex-col gap-4 px-4 py-8 mx-8 w-xl'>
          <CardHeader>
            <CardTitle className='text-lg text-center'>
              You got {`${numRight()}`} out of {`${words.length}`} correct!
            </CardTitle>
          </CardHeader>
          <CardContent>
            
          </CardContent>
          <CardFooter className='flex flex-col gap-2'>
            <Button onClick={() => navigate('/practice')} variant='outline' className='w-50 h-10 text-sm border-2 hover:bg-gray-100 hover:text-inherit'>
            Return to Practice
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <MultipleChoiceCard key={words[curr].id} word={words[curr]} curr={curr} setCurr={setCurr} setResults={setResults} />
  )
}

export default MultipleChoice