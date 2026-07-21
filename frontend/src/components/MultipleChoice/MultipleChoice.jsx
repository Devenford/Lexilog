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
import { Loader2 } from 'lucide-react'

const MultipleChoice = ({ setUser }) => {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [words, setWords] = useState([])
  const [curr, setCurr] = useState(0)   // current word index in words array
  const [loading, setLoading] = useState(true) // still fetching quiz words
  const [finalResult, setFinalResult] = useState(null)

  useEffect(() => {
    const fetchWords = async () => {
      const data = await getMultipleChoiceWords()
      setWords(data)
      setLoading(false)
    }

    fetchWords()
  }, [])

  useEffect(() => {
    if (loading || curr !== words.length) { // Add || finalResult, if the useEffect dependency array changes (Ex: [curr, words, results]), to ensure submit isn't called again after the finalResult has been received and state updated
      return
    }

    const submit = async () => {
      const response = await sendMultipleChoiceResults(results)
      setFinalResult(response)
      setUser(user => ({
        ...user,
        coins: user.coins + response.coinsGained,
        xp: user.xp + response.xpGained,
        monthlyXp: user.monthlyXp + response.xpGained
      }))
    }

    submit()
  }, [curr])

  const numRight = () => results.reduce((sum, r) => r.tries === 1 ? sum + 1 : sum, 0)

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading quiz...
        </p>
      </div>
    )
  }

  if (curr === words.length) {
    if (!finalResult) { // final result hasn't been received yet
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Calculating results...
          </p>
        </div>
      )
    }

    return (
      <div className='flex justify-center'>
        <Card className='flex flex-col gap-4 px-4 py-8 mx-8 w-xl'>
          <CardHeader>
            <CardTitle className='text-lg text-center'>
              You got {`${numRight()}`} out of {`${words.length}`} correct!
            </CardTitle>
          </CardHeader>
          <CardTitle className='flex items-center justify-center gap-2 text-lg'>
	          XP: + {finalResult.xpGained}
            <img src='../../../images/xp.svg' alt='XP' className='h-8 w-8'/>
          </CardTitle>
          <CardTitle className='flex items-center justify-center gap-2 text-lg'>
	          Coins: + {finalResult.coinsGained}<img src='../../../images/coin.svg' alt='Coin' className='h-8 w-8'/>
          </CardTitle>
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