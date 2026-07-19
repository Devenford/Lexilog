import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'


const OptionButton = ({ option, answer, setTries, completed, setCompleted }) => {
  const [value, setValue] = useState('')
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (!clicked && !completed) {  // if it hasn't been clicked yet, i.e. being clicked for the first time, and the question hasn't been answered (i.e. the user hasn't guessed the right answer yet)
      if (option === answer) {
        setValue('success')
        toast('Correct', { position: 'top-center' })
        setCompleted(true)
      }
      else {
        setValue('destructive')
        toast('Try Again', { position: 'top-center' })
      }
      setClicked(true)
      setTries(t => t + 1)
    }
  }

  return (
    <Button onClick={handleClick} variant={value} className='text-base h-14'>
      {option}
    </Button>
  )
}

export default OptionButton