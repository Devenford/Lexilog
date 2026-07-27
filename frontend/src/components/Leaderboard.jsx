import { useState, useEffect } from 'react'
import leaderboardService from '../services/leaderboard'

import { Loader2 } from 'lucide-react'
import {
  Card
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const Leaderboard = ({ type }) => {
  const [leaderboards, setLeaderboards] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const leaderBoardData = await leaderboardService.getLeaderBoardData()
      setLeaderboards(leaderBoardData)
    }

    fetchData()
  }, [])

  if (!leaderboards) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading ...
        </p>
      </div>
    )
  }

  const titles = {
    xp: 'XP',
    coins: 'Coins',
    monthlyXp: 'Monthly XP'
  }

  let data = []
  switch(type) {
  case 'coins':
    data = leaderboards.usersByCoins
    break
  case 'xp':
    data = leaderboards.usersByXp
    break
  case 'monthlyXp':
    data = leaderboards.usersByMonthlyXp
    break
  }

  return (
    <Card className='max-w-5xl mx-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-black text-lg text-center'>Rank</TableHead>
            <TableHead  className='text-black text-lg text-center'>Username</TableHead>
            <TableHead className='text-black text-lg text-center'>{titles[type]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((u, i) => ( // u = user, i = index
            <TableRow key={u.id}>
              <TableCell className='text-lg text-center'>
                {i + 1}
              </TableCell>
              <TableCell className='text-lg text-center'>
                {u.username}
              </TableCell>
              <TableCell className='text-lg text-center'>
                {u[type]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default Leaderboard