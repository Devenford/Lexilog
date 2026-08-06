const testWord = {
  word: 'convention',
  difficulty: 'Easy',
  options: [
    'convention',
    'tradition',
    'gathering',
    'agreement'
  ],
  paragraphs: [
    'The annual comic book _____________ attracted thousands of fans dressed as their favorite characters. Artists and writers set up booths to sell their work, sign autographs, and host panels for the enthusiastic crowd.',
    'In many cultures, shaking hands when meeting someone for the first time is a standard social _____________. Breaking this unspoken rule can make the interaction feel incredibly awkward and disrespectful.',
    'The nation signed an international _____________ regarding the humane treatment of prisoners of war. This historic document established global standards that all military forces were expected to follow during times of conflict.'
  ],
  definitions: [
    {
      definition: 'a large meeting or assembly of people for a common interest',
      paragraphIndices: [
        0
      ]
    },
    {
      definition: 'a standard social custom or accepted practice',
      paragraphIndices: [
        1
      ]
    },
    {
      definition: 'a formal international agreement or treaty',
      paragraphIndices: [
        2
      ]
    }
  ],
  synonyms: [
    'assembly',
    'custom',
    'treaty',
    'practice'
  ]
}

const testQuiz = [
  {
    'word': 'anodyne',
    'difficulty': 'Hard',
    'options': [
      'anodyne',
      'provocative',
      'inflammatory',
      'contentious'
    ],
    'paragraphs': [
      'The candidate chose to deliver an _____________ speech that avoided any controversial topics, hoping to appeal to a broad range of voters. While the message was safe and polite, it failed to inspire any real passion in the audience.',
      'In her attempt to minimize the conflict, she offered an _____________ remark that diffused the tension without addressing the root cause of the argument. It was a diplomatic maneuver designed to keep the peace at all costs.',
      'The consultant suggested using more _____________ language in the company\'s public relations materials to prevent further backlash from stakeholders. By removing any edge or sharp opinion, they hoped to return to a neutral public image.'
    ],
    'definitions': [
      {
        'definition': 'not likely to provoke dissent or offense; inoffensive and dull',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93c049'
      }
    ],
    'synonyms': [
      'inoffensive',
      'bland',
      'neutral',
      'innocuous'
    ],
    'id': '6a5faffa2f495f7f6b93c048'
  },
  {
    'word': 'negate',
    'difficulty': 'Easy',
    'options': [
      'neutralize',
      'negate',
      'refute',
      'cancel'
    ],
    'paragraphs': [
      'Drinking sugary sodas right after a hard workout can easily _____________ the health benefits of your exercise routine. Personal trainers advise drinking water or herbal tea instead to stay hydrated.',
      'Adding a negative charge to the experimental compound will _____________ the positive electrical forces previously observed. The researchers carefully measured the resulting neutral state of the mixture.',
      'The defense attorney argued that the new evidence would _____________ the prosecutor\'s main claims about the timeline of the crime. If the judge accepted this argument, the entire case would fall apart.'
    ],
    'definitions': [
      {
        'definition': 'to nullify or make ineffective',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bb47'
      }
    ],
    'synonyms': [
      'invalidate',
      'cancel',
      'void',
      'nullify'
    ],
    'id': '6a5faffa2f495f7f6b93bb46'
  },
  {
    'word': 'grouse',
    'difficulty': 'Easy',
    'options': [
      'grouse',
      'celebrate',
      'rejoice',
      'applaud'
    ],
    'paragraphs': [
      'Despite the team\'s successful season, the coach continued to _____________ about the players\' lack of focus during afternoon drills. He felt that perfection was the only acceptable standard.',
      'It is common for commuters to _____________ when the morning train is delayed by even a few minutes. Many vent their frustrations on social media while waiting on the platform.',
      'Employees often _____________ when new management policies are introduced without prior consultation. These complaints usually center around the extra administrative work required by the updated systems.'
    ],
    'definitions': [
      {
        'definition': 'to complain in a grumbling or peevish way',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bc88'
      }
    ],
    'synonyms': [
      'complain',
      'gripe',
      'whine',
      'bellyache'
    ],
    'id': '6a5faffa2f495f7f6b93bc87'
  },
  {
    'word': 'supersede',
    'difficulty': 'Easy',
    'options': [
      'implement',
      'supersede',
      'displace',
      'delegate'
    ],
    'paragraphs': [
      'The company decided to update their aging computer network last month. The new software will quickly _____________ the outdated system currently in use.',
      'Legislators debated the new environmental bill throughout the afternoon session. Once passed, the updated regulations will _____________ the old laws that have been on the books for decades.',
      'The invention of the automobile changed how people traveled across the country. Eventually, the efficiency of cars began to _____________ the reliance on horse-drawn carriages for long-distance transport.'
    ],
    'definitions': [
      {
        'definition': 'to take the place of something outdated or less effective',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93c0c8'
      }
    ],
    'synonyms': [
      'replace',
      'supplant',
      'overtake',
      'displace'
    ],
    'id': '6a5faffa2f495f7f6b93c0c7'
  },
  {
    'word': 'occult',
    'difficulty': 'Easy',
    'options': [
      'occult',
      'transparent',
      'frequent',
      'luminous'
    ],
    'paragraphs': [
      'Many historians have studied the secret societies that practiced various _____________ rituals in the nineteenth century. These groups often operated in complete secrecy, away from public view.',
      'The astronomer waited for the moon to _____________ the distant star during the night of the eclipse. The celestial event was brief but provided valuable data to the research team.',
      'She possessed an interest in _____________ phenomena that most people dismissed as folklore. Her library was filled with dusty, ancient texts detailing mysterious events and forgotten legends.'
    ],
    'definitions': [
      {
        'definition': 'supernatural, mystical, or secret practices and beliefs',
        'paragraphIndices': [
          0,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bc51'
      },
      {
        'definition': 'to block or conceal one celestial body with another',
        'paragraphIndices': [
          1
        ],
        'id': '6a5faffa2f495f7f6b93bc52'
      }
    ],
    'synonyms': [
      'mystical',
      'supernatural',
      'esoteric',
      'arcane'
    ],
    'id': '6a5faffa2f495f7f6b93bc50'
  },
  {
    'word': 'clamor',
    'difficulty': 'Easy',
    'options': [
      'discussion',
      'protest',
      'clamor',
      'murmur'
    ],
    'paragraphs': [
      'The constant _____________ of traffic and construction made it nearly impossible to sleep in the downtown apartment. Sirens, honking horns, and shouting pedestrians created a relentless wall of sound.',
      'There was a growing public _____________ for the politician to resign after the scandal was exposed. Citizens flooded the streets and jammed the phone lines, loudly demanding immediate accountability.',
      'At dawn, the forest filled with the _____________ of hundreds of nesting birds waking up at once. The chaotic mix of chirping, squawking, and flapping wings echoed through the trees.'
    ],
    'definitions': [
      {
        'definition': 'a loud and confused noise or an insistent public outcry',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bb9d'
      }
    ],
    'synonyms': [
      'uproar',
      'din',
      'commotion',
      'shout'
    ],
    'id': '6a5faffa2f495f7f6b93bb9c'
  },
  {
    'word': 'prattle',
    'difficulty': 'Medium',
    'options': [
      'prattle',
      'chatter',
      'dialogue',
      'oration'
    ],
    'paragraphs': [
      'The toddler continued to _____________ on about his favorite toys while we tried to watch the evening news. His cheerful voice filled the room, though it was difficult to understand every word.',
      'The delegates grew tired of listening to the opponent _____________ about irrelevant historical grievances. They wanted the meeting to focus strictly on the current trade agreement.',
      'I could hear the students begin to _____________ in the back of the lecture hall as the professor finished her slides. Their mindless talk grew louder until the teacher finally asked for silence.'
    ],
    'definitions': [
      {
        'definition': 'to talk at length in a foolish or inconsequential way',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bcaa'
      }
    ],
    'synonyms': [
      'chatter',
      'babble',
      'gabble',
      'chatterbox'
    ],
    'id': '6a5faffa2f495f7f6b93bca9'
  },
  {
    'word': 'sordid',
    'difficulty': 'Easy',
    'options': [
      'sordid',
      'pristine',
      'virtuous',
      'splendid'
    ],
    'paragraphs': [
      'The investigator spent weeks uncovering the _____________ details of the scandal that had rocked the small town. Every new piece of information revealed just how deep the deception went.',
      'Walking through the _____________ alleyways of the old district, they realized the city had neglected infrastructure in the poorer neighborhoods for decades. Trash lined the streets and the buildings were crumbling.',
      'He refused to be associated with the _____________ scheme, even though it promised a significant profit. He preferred to maintain his integrity rather than gain wealth through dishonest means.'
    ],
    'definitions': [
      {
        'definition': 'involving ignoble actions and motives that arouse moral distaste or showing neglect',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bc01'
      }
    ],
    'synonyms': [
      'sleazy',
      'shameful',
      'dirty',
      'corrupt'
    ],
    'id': '6a5faffa2f495f7f6b93bc00'
  },
  {
    'word': 'decorum',
    'difficulty': 'Easy',
    'options': [
      'solemnity',
      'decorum',
      'etiquette',
      'formality'
    ],
    'paragraphs': [
      'The judge strictly enforced the rules of the courtroom to maintain the necessary _____________. Attorneys were expected to dress professionally and speak only when addressed. Any outburst from the gallery was met with immediate removal.',
      'Although the gala was a celebratory event, guests were reminded to behave with proper _____________. Loud laughter and boisterous behavior were looked down upon by the hosts. Standard social expectations required a quiet elegance throughout the evening.',
      'The headmaster believed that academic success began with classroom _____________. Students were taught to sit upright, raise their hands before speaking, and show respect to their peers. This structured environment kept distractions to a minimum.'
    ],
    'definitions': [
      {
        'definition': 'behavior in keeping with good taste and propriety',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bbc3'
      }
    ],
    'synonyms': [
      'etiquette',
      'propriety',
      'dignity',
      'politeness',
      'decency'
    ],
    'id': '6a5faffa2f495f7f6b93bbc2'
  },
  {
    'word': 'sardonic',
    'difficulty': 'Easy',
    'options': [
      'sardonic',
      'sincere',
      'earnest',
      'gullible'
    ],
    'paragraphs': [
      'His _____________ humor often left the room in silence because his coworkers were never quite sure if he was joking or being cruel. He had a habit of making biting remarks about the quality of the coffee.',
      'She delivered a _____________ comment about the politician\'s promise to lower taxes, knowing full well that the proposal was dead on arrival. Her colleagues chuckled nervously at her lack of faith in the system.',
      'Despite the gravity of the situation, the comedian kept up his _____________ tone, mocking the very people who were trying to help. It was a defense mechanism that kept everyone at a safe emotional distance.'
    ],
    'definitions': [
      {
        'definition': 'grimly mocking, cynical, or scornfully sarcastic',
        'paragraphIndices': [
          0,
          1,
          2
        ],
        'id': '6a5faffa2f495f7f6b93bf23'
      }
    ],
    'synonyms': [
      'mocking',
      'cynical',
      'sarcastic',
      'derisive'
    ],
    'id': '6a5faffa2f495f7f6b93bf22'
  }
]

const testUser = {
  username: 'Bob1234',
  coins: 0,
  xp: 0,
  monthlyXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  id: '6a67d27e615449abc179d123',
}

const testResults = [
  {
    id: '6a5faffa2f495f7f6b93c048',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bb46',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bc87',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93c0c7',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bc50',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bb9c',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bca9',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bc00',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bbc2',
    tries: 1
  },
  {
    id: '6a5faffa2f495f7f6b93bf22',
    tries: 1
  }
]

const testScore = {
  numCorrect : 10,
  coinsGained: 20,
  xpGained: 60,
  currentStreak: 1,
  longestStreak: 1
}

export default {
  testWord,
  testUser,
  testQuiz,
  testResults,
  testScore
}