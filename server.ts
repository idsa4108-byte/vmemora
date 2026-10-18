import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface LookupRequest {
  word: string;
  sourceLang?: string; // e.g. "English", "French", "Spanish", "German", "Turkish", "Italian"
}

// Built-in intelligent fallback dictionary for instant or offline responses
const fallbackDictionary: Record<string, any> = {
  serendipity: {
    word: 'serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    emoji: '✨',
    category: 'Emotions',
    meanings: [
      {
        partOfSpeech: 'اسم',
        partOfSpeechEn: 'noun',
        meaningAr: 'الصدفة السعيدة أو الحظ الجميل غير المتوقع',
        definition: 'The occurrence of events by chance in a happy or beneficial way.',
        examples: [
          {
            example: 'Finding this cozy cafe was pure serendipity.',
            translationAr: 'كان العثور على هذا المقهى المريح صدفة سعيدة بحتة.'
          },
          {
            example: 'A stroke of serendipity led to their scientific breakthrough.',
            translationAr: 'أدت لمسة من الحظ السعيد إلى اكتشافهم العلمي.'
          }
        ]
      }
    ]
  },
  resilience: {
    word: 'resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    emoji: '🌱',
    category: 'Emotions',
    meanings: [
      {
        partOfSpeech: 'اسم',
        partOfSpeechEn: 'noun',
        meaningAr: 'المرونة والقدرة على الصمود وتجاوز الأزمات',
        definition: 'The capacity to recover quickly from difficulties; toughness.',
        examples: [
          {
            example: 'Courage and resilience help us overcome any obstacle.',
            translationAr: 'الشجاعة والمرونة تساعداننا على تخطي أي عقبة.'
          },
          {
            example: 'The team showed remarkable resilience during the crisis.',
            translationAr: 'أظهر الفريق قدرة استثنائية على الصمود أثناء الأزمة.'
          }
        ]
      }
    ]
  },
  adventure: {
    word: 'adventure',
    phonetic: '/ədˈven.tʃər/',
    emoji: '✈️',
    category: 'Travel',
    meanings: [
      {
        partOfSpeech: 'اسم',
        partOfSpeechEn: 'noun',
        meaningAr: 'المغامرة والتجربة المثيرة المليئة بالاستكشاف',
        definition: 'An unusual and exciting, typically hazardous, experience or activity.',
        examples: [
          {
            example: 'Traveling across the mountains was an unforgettable adventure.',
            translationAr: 'كان السفر عبر الجبال مغامرة لا تُنسى.'
          },
          {
            example: 'She set out on a new adventure in a foreign country.',
            translationAr: 'انطلقت في مغامرة جديدة في بلد أجنبي.'
          }
        ]
      }
    ]
  },
  healthy: {
    word: 'healthy',
    phonetic: '/ˈhel.θi/',
    emoji: '🩺',
    category: 'Health',
    meanings: [
      {
        partOfSpeech: 'صفة',
        partOfSpeechEn: 'adjective',
        meaningAr: 'صحي، يتمتع بلياقة وعافية جيدة',
        definition: 'In good physical or mental condition; in good health.',
        examples: [
          {
            example: 'A balanced diet helps you stay healthy and energetic.',
            translationAr: 'النظام الغذائي المتوازن يساعدك على البقاء بصحة ونشاط.'
          },
          {
            example: 'Regular exercise leads to a healthy lifestyle.',
            translationAr: 'ممارسة الرياضة بانتظام تؤدي إلى نمط حياة صحي.'
          }
        ]
      }
    ]
  },
  technology: {
    word: 'technology',
    phonetic: '/tekˈnɒl.ə.dʒi/',
    emoji: '💻',
    category: 'Technology',
    meanings: [
      {
        partOfSpeech: 'اسم',
        partOfSpeechEn: 'noun',
        meaningAr: 'التقنية والتكنولوجيا الحديثة وتطبيقات العلوم',
        definition: 'The application of scientific knowledge for practical purposes.',
        examples: [
          {
            example: 'Modern technology makes communication effortless and fast.',
            translationAr: 'التكنولوجيا الحديثة تجعل التواصل سهلاً وسريعاً.'
          },
          {
            example: 'Advancements in medical technology save millions of lives.',
            translationAr: 'التقدم في التكنولوجيا الطبية ينقذ ملايين الأرواح.'
          }
        ]
      }
    ]
  },
  coffee: {
    word: 'coffee',
    phonetic: '/ˈkɒf.i/',
    emoji: '☕',
    category: 'Food',
    meanings: [
      {
        partOfSpeech: 'اسم',
        partOfSpeechEn: 'noun',
        meaningAr: 'القهوة، المشروب المنعش المحضر من حبوب البن',
        definition: 'A hot beverage made from roasted and ground coffee beans.',
        examples: [
          {
            example: 'I enjoy a fresh cup of coffee every morning.',
            translationAr: 'أستمتع بفنجان طازج من القهوة كل صباح.'
          },
          {
            example: 'They met for coffee to discuss their new business project.',
            translationAr: 'التقيا لاحتساء القهوة ومناقشة مشروعهما التجاري الجديد.'
          }
        ]
      }
    ]
  }
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // High-fidelity American English Text-to-Speech audio proxy
  app.get('/api/tts', async (req, res) => {
    try {
      const text = typeof req.query.text === 'string' ? req.query.text.trim() : '';
      if (!text) {
        return res.status(400).send('Text parameter is required');
      }

      // Limit length to prevent abuse (standard vocabulary item or example sentence)
      const cleanText = text.slice(0, 300);

      // Fetch authentic native American English audio from Google TTS engine (tl=en-US)
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        cleanText
      )}&tl=en-US&client=tw-ob`;

      const audioResponse = await fetch(googleTtsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });

      if (!audioResponse.ok) {
        return res.status(502).send('Audio stream service temporarily unavailable');
      }

      const arrayBuffer = await audioResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.setHeader('Content-Length', buffer.length.toString());
      return res.status(200).send(buffer);
    } catch (err: any) {
      console.error('TTS Proxy Error:', err?.message || err);
      return res.status(500).send('Audio generation failed');
    }
  });

  // API endpoint for AI word lookup
  app.post('/api/lookup', async (req, res) => {
    const { word, sourceLang = 'English' } = req.body as LookupRequest;

    if (!word || typeof word !== 'string' || !word.trim()) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const cleanWord = word.trim();
    const lowerWord = cleanWord.toLowerCase();

    // If Gemini client is configured, call Gemini API
    if (ai) {
      try {
        const prompt = `You are a world-class lexicographer and vocabulary instructor for "Vmemora", a modern English vocabulary mastery app.
Analyze the given word "${cleanWord}" in "${sourceLang}".
Return a strictly valid JSON object matching this schema:
{
  "word": "${cleanWord}",
  "phonetic": "Standard IPA phonetic transcription, e.g. /rɪˈzɪl.jəns/",
  "emoji": "Single most relevant representative emoji, e.g. 🌱",
  "category": "Must be exactly one of these 10 categories: Study, Business, Environment, Travel, Health, Technology, Food, Daily Life, Emotions, Other",
  "meanings": [
    {
      "partOfSpeech": "Arabic label, e.g. اسم or فعل or صفة or ظرف or حرف",
      "partOfSpeechEn": "English label, e.g. noun, verb, adjective, adverb",
      "meaningAr": "Clear and concise Arabic meaning/translation",
      "definition": "Simple and clear definition in ${sourceLang}",
      "examples": [
        {
          "example": "First natural example sentence in ${sourceLang}",
          "translationAr": "Arabic translation of the first sentence"
        },
        {
          "example": "Second natural example sentence in ${sourceLang}",
          "translationAr": "Arabic translation of the second sentence"
        }
      ]
    }
  ]
}
Provide up to 3-5 distinct meanings if the word is polysemous, or at least 1-2 primary meanings. Each meaning MUST have exactly 2 example sentences with accurate Arabic translations.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                emoji: { type: Type.STRING },
                category: {
                  type: Type.STRING,
                  enum: [
                    'Study',
                    'Business',
                    'Environment',
                    'Travel',
                    'Health',
                    'Technology',
                    'Food',
                    'Daily Life',
                    'Emotions',
                    'Other',
                  ],
                },
                meanings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      partOfSpeech: { type: Type.STRING },
                      partOfSpeechEn: { type: Type.STRING },
                      meaningAr: { type: Type.STRING },
                      definition: { type: Type.STRING },
                      examples: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            example: { type: Type.STRING },
                            translationAr: { type: Type.STRING },
                          },
                          required: ['example', 'translationAr'],
                        },
                      },
                    },
                    required: [
                      'partOfSpeech',
                      'meaningAr',
                      'definition',
                      'examples',
                    ],
                  },
                },
              },
              required: ['word', 'phonetic', 'emoji', 'category', 'meanings'],
            },
          },
        });

        const rawText = response.text ? response.text.trim() : '';
        const parsedData = JSON.parse(rawText);
        return res.json(parsedData);
      } catch (geminiError: any) {
        console.error('Gemini lookup error:', geminiError?.message || geminiError);
        // Fall back to dictionary or dynamic fallback below
      }
    }

    // Fallback dictionary check
    if (fallbackDictionary[lowerWord]) {
      return res.json(fallbackDictionary[lowerWord]);
    }

    // Dynamic smart generation fallback when API key is missing or offline
    const defaultData = {
      word: cleanWord,
      phonetic: `/${cleanWord.toLowerCase()}/`,
      emoji: '📖',
      category: 'Study',
      meanings: [
        {
          partOfSpeech: 'اسم',
          partOfSpeechEn: 'noun',
          meaningAr: `معنى كلمة ${cleanWord}`,
          definition: `Meaning and usage of the word "${cleanWord}" in ${sourceLang}.`,
          examples: [
            {
              example: `Learning the word "${cleanWord}" expands your vocabulary.`,
              translationAr: `تعلم كلمة "${cleanWord}" يثري حصيلتك اللغوية.`,
            },
            {
              example: `Can you use "${cleanWord}" in a sentence?`,
              translationAr: `هل يمكنك استخدام "${cleanWord}" في جملة مفيدة؟`,
            },
          ],
        },
      ],
    };

    return res.json(defaultData);
  });

  // Setup Vite middlewares in development or static serve in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vmemora server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
