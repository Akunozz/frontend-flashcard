// Import or define the Deck type above
// Example import (adjust the path as needed)

export type Card = {
    id: string;
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
};

export type Deck = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    studyStats: {
        totalStudies: number;
        correctAnswers: number;
        incorrectAnswers: number;
    };
    cards: Card[];
};

export const mockDecks: Deck[] = [
    {
        id: '1',
        title: 'Matemática Básica',
        description: 'Operações fundamentais e conceitos básicos',
        createdAt: new Date('2024-01-15'),
        studyStats: {
            totalStudies: 125,
            correctAnswers: 89,
            incorrectAnswers: 36
        },
        cards: [
            {
                id: '1-1',
                question: 'Quanto é 15 + 27?',
                answer: '42',
                difficulty: 'easy',
                category: 'Adição'
            },
            {
                id: '1-2',
                question: 'Qual é a raiz quadrada de 144?',
                answer: '12',
                difficulty: 'medium',
                category: 'Raízes'
            },
            {
                id: '1-3',
                question: 'Resolva: 3x + 5 = 14',
                answer: 'x = 3',
                difficulty: 'hard',
                category: 'Equações'
            },
            {
                id: '1-4',
                question: 'Quanto é 8 × 7?',
                answer: '56',
                difficulty: 'easy',
                category: 'Multiplicação'
            },
            {
                id: '1-5',
                question: 'Qual é 25% de 200?',
                answer: '50',
                difficulty: 'medium',
                category: 'Porcentagem'
            }
        ]
    },
    {
        id: '2',
        title: 'História do Brasil',
        description: 'Principais eventos da história brasileira',
        createdAt: new Date('2024-02-20'),
        studyStats: {
            totalStudies: 78,
            correctAnswers: 52,
            incorrectAnswers: 26
        },
        cards: [
            {
                id: '2-1',
                question: 'Em que ano foi proclamada a Independência do Brasil?',
                answer: '1822',
                difficulty: 'easy',
                category: 'Independência'
            },
            {
                id: '2-2',
                question: 'Quem foi o primeiro presidente do Brasil?',
                answer: 'Deodoro da Fonseca',
                difficulty: 'medium',
                category: 'República'
            },
            {
                id: '2-3',
                question: 'Qual foi a duração do período colonial brasileiro?',
                answer: '322 anos (1500-1822)',
                difficulty: 'hard',
                category: 'Colônia'
            }
        ]
    },
    {
        id: '3',
        title: 'Inglês - Verbos Irregulares',
        description: 'Principais verbos irregulares em inglês',
        createdAt: new Date('2024-03-10'),
        studyStats: {
            totalStudies: 95,
            correctAnswers: 67,
            incorrectAnswers: 28
        },
        cards: [
            {
                id: '3-1',
                question: 'Past tense of "go"',
                answer: 'went',
                difficulty: 'easy',
                category: 'Irregular Verbs'
            },
            {
                id: '3-2',
                question: 'Past participle of "see"',
                answer: 'seen',
                difficulty: 'medium',
                category: 'Irregular Verbs'
            },
            {
                id: '3-3',
                question: 'Past tense and past participle of "bring"',
                answer: 'brought, brought',
                difficulty: 'hard',
                category: 'Irregular Verbs'
            }
        ]
    }
];

// Import or define the StudySession type above
// Example import (adjust the path as needed):
// import { StudySession } from '../types';

// Or define it directly here if not imported:
type StudySession = {
  deckId: string;
  date: Date;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
};

export const mockStudySessions: StudySession[] = [
  {
    deckId: '1',
    date: new Date('2024-03-20'),
    correctAnswers: 8,
    totalQuestions: 10,
    timeSpent: 120
  },
  {
    deckId: '1',
    date: new Date('2024-03-19'),
    correctAnswers: 7,
    totalQuestions: 10,
    timeSpent: 105
  },
  {
    deckId: '2',
    date: new Date('2024-03-18'),
    correctAnswers: 5,
    totalQuestions: 8,
    timeSpent: 95
  },
  {
    deckId: '3',
    date: new Date('2024-03-17'),
    correctAnswers: 9,
    totalQuestions: 12,
    timeSpent: 140
  },
  {
    deckId: '1',
    date: new Date('2024-03-16'),
    correctAnswers: 6,
    totalQuestions: 8,
    timeSpent: 85
  }
];

export const getStudyStatsData = () => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  });

  return [
    { day: last7Days[0], sessions: 2, accuracy: 75 },
    { day: last7Days[1], sessions: 3, accuracy: 82 },
    { day: last7Days[2], sessions: 1, accuracy: 90 },
    { day: last7Days[3], sessions: 4, accuracy: 68 },
    { day: last7Days[4], sessions: 2, accuracy: 85 },
    { day: last7Days[5], sessions: 3, accuracy: 78 },
    { day: last7Days[6], sessions: 5, accuracy: 88 }
  ];
};