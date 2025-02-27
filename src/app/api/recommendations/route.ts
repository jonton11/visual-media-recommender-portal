import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for the request
const RequestSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['show', 'movie']).optional(),
})

// Validation schema for LLM response
const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  matchPercentage: z.number().min(0).max(100),
})

const SYSTEM_PROMPT = `You are a helpful TV show and movie recommendation assistant. 
Given a show or movie that someone enjoyed, you will provide 3 similar recommendations.
Each recommendation should include:
- Title
- Brief description (1-2 sentences)
- Match percentage (0-100) based on similarity to the original

Format your response as valid JSON with this exact structure:
{
  "recommendations": [
    {
      "title": "Show Name",
      "description": "Show description",
      "matchPercentage": 85
    }
  ]
}`

const USER_PROMPT = (title: string) => 
  `Suggest 3 shows/movies similar to "${title}". Focus on similar themes, style, or tone.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title } = RequestSchema.parse(body)

    // Rate limiting check would go here

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-0125-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT(title) }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations')
    }

    const data = await response.json()
    const recommendations = JSON.parse(data.choices[0].message.content).recommendations

    // Validate LLM response
    const validatedRecommendations = recommendations.map(rec => 
      RecommendationSchema.parse(rec)
    )

    return NextResponse.json({ recommendations: validatedRecommendations })

  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
} 