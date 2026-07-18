import { useNavigate } from 'react-router-dom'
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

const Practice = () => {
  const navigate = useNavigate()

  return (
    <div className='flex justify-center'>
      <Card className='flex flex-col gap-4 px-4 py-8 mx-8 w-xl'>
        <CardHeader>
          <CardTitle className='text-lg text-center'>
            Choose your format
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Button
            onClick={() => navigate('/practice/multiplechoice')}
            size='lg'
            className='rounded-full h-14 text-base'
          >
            Multiple Choice
          </Button>
          <Button
            onClick={() => navigate('/practice/spelling')}
            size='lg'
            className='rounded-full h-14 text-base'
          >
            Spelling
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Practice