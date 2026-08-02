import { useState, useEffect, useRef } from 'react'
import dictionaryapiService from '../../services/dictionaryapi'

import { CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WordInfo = ({ word, paragraph }) => {
  const [audio, setAudio] = useState(null)
  const [phonetic, setPhonetic] = useState(null)
  const audioRef = useRef(null) // to access the <audio /> DOM element that's rendered

  useEffect(() => {
    const loadPhonetics = async () => {
      const phonetics = await dictionaryapiService.getPhonetics(word.word)
      if (!phonetics) {
        setPhonetic(null)
        setAudio(null)
        return
      }

      setPhonetic(phonetics.text || null)
      setAudio(phonetics.audio || null)
    }

    loadPhonetics()
  }, [word])

  const getDefinitions = () => word.definitions.filter(d => d.paragraphIndices.includes(paragraph))

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(`The word is: ${word.word}.`)
    utterance.lang = 'en-US'
    utterance.rate = 0.8

    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang === 'en-US') ?? voices.find(v => v.lang.startsWith('en'))

    if (voice) {
      utterance.voice = voice
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const playAudio = async () => {
    if (audio && audioRef.current) {
      try {
        await audioRef.current.play()
        return
      }
      catch {
        // Dictionary API returns a broken/unsupported audio URL
      }
    }

    speakWord()
  }

  return (
    <CardContent className='space-y-6'>
      <section>
        <div className='flex items-center gap-4 my-2'>
          <h3 className='text-base font-semibold uppercase tracking-wide text-muted-foreground'>
          Definition
          </h3>
          <span className='text-base'>{phonetic}</span>

          { audio && <audio ref={audioRef} src={audio} />}

          <Tooltip>
            <TooltipTrigger render={
              <Button
                variant='ghost'
                size='icon'
                className='h-10 w-10 hover:bg-gray-100 hover:text-inherit'
                onClick={playAudio}
              >
                <Volume2 className='h-6 w-6'/>
              </Button>
            } />
            <TooltipContent side='right'>
              <p className='text-base'>Play pronunciation</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <ul className='list-disc space-y-2 pl-5 text-base'>
          {getDefinitions().map(d => (
            <li key={d.id} className='leading-relaxed'>
              {d.definition}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className='mb-2 text-base font-semibold uppercase tracking-wide text-muted-foreground'>
          Synonyms
        </h3>

        <div className='flex flex-wrap gap-2 text-base'>
          {word.synonyms.map(s => (
            <Badge key={s} variant='secondary' className='text-base'>
              {s}
            </Badge>
          ))}
        </div>
      </section>
    </CardContent>
  )
}

export default WordInfo