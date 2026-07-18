import { useState } from 'react'
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
import { toast } from 'sonner'

const MultipleChoiceButtons = ({ words, curr, options, setNumTries }) => {
  const [buttonStates, setbuttonStates] = useState([
    {
      value: '',
      clicked: false,
    },
    {
      value: '',
      clicked: false,
    },
    {
      value: '',
      clicked: false,
    },
    {
      value: '',
      clicked: false,
    }
  ])
  const [tries, setTries] = useState(1)

  const handleOptionClick = (buttonNum) => {
    if (buttonStates[buttonNum].clicked === false) {
      if (options[buttonNum] === words[curr].word) { // right answer
        const tempButtonStates = [...buttonStates]
        tempButtonStates[buttonNum].value = 'success'
        tempButtonStates[buttonNum].clicked = true
        setbuttonStates(tempButtonStates)

        toast('Correct', { position: 'top-center' })
        setTries(tries+1)
      }
      else {
        const tempButtonStates = [...buttonStates]
        tempButtonStates[buttonNum].value = 'destructive'
        tempButtonStates[buttonNum].clicked = true
        setbuttonStates(tempButtonStates)

        toast('Try Again', { position: 'top-center' })
        setTries(tries+1)
      }
    }
  }

  return (
    <CardContent className='grid grid-cols-2 grid-rows-2 gap-2'>
      <Button onClick={() => handleOptionClick(0)} variant={buttonStates[0].value} className='text-base h-14'>
        {options[0]}
      </Button>
      <Button onClick={() => handleOptionClick(1)} variant={buttonStates[1].value} className='text-base h-14'>
        {options[1]}
      </Button>
      <Button onClick={() => handleOptionClick(2)} variant={buttonStates[2].value} className='text-base h-14'>
        {options[2]}
      </Button>
      <Button onClick={() => handleOptionClick(3)} variant={buttonStates[3].value} className='text-base h-14'>
        {options[3]}
      </Button>
    </CardContent>
  )
}

export default MultipleChoiceButtons