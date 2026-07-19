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

const Home = ({ user }) => {
  if (user) {
    return (
      <div>
        <Card className='px-4 py-8 mx-8'>
          <CardHeader>
            <CardTitle className='text-xl'>
              Welcome back {`${user.username}`}
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 text-base'>
            <p>
              Click on Practice to start.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Card className='px-4 py-8 mx-8'>
        <CardHeader>
          <CardTitle className='text-xl'>
            Unlock the Power of Words
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 text-base'>
          <p>
            Expand your vocabulary with personalized learning, daily practice, and smart revision. Lexilog helps you remember more, express yourself better, and keep growing—one word at a time.
          </p>
          <p>
          Complete daily challenges, earn rewards, build streaks, and master new words.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home