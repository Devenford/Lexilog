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
import { Progress } from '@/components/ui/progress'

const Home = ({ user }) => {
  if (user) {
    const percentageComplete = (user.masteredWords/user.totalWords) * 100

    return (
      <Card className='px-4 py-8 mx-8'>
        <CardHeader>
          <CardTitle className='text-xl'>
              Welcome back {`${user.username}`} 😊
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-8 text-base'>
          <p className='text-lg'>
              Click on Practice to start.
          </p>
          <div className='font-bold text-lg'>
            {user.masteredWords}/{user.totalWords} Words Mastered
            <Progress
              trackClassName='h-6 rounded-full'
              indicatorClassName='bg-green-500'
              value={percentageComplete}
            />
          </div>
          <div className='font-bold text-lg'>
            <p>
              🔥 Streak: {user.currentStreak} {user.currentStreak === 1 ? 'day': 'days'}
            </p>
            <p>
              ⭐ Longest Streak: {user.longestStreak} {user.longestStreak === 1 ? 'day': 'days'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
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
  )
}

export default Home