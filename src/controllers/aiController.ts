import { Request, Response } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const GITHUB_MODELS_URL = 'https://models.inference.ai.azure.com/chat/completions';
const GITHUB_TOKEN = process.env.GITHUB_PAT || process.env.Github_API_KEY;

export const aiCoachChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!GITHUB_TOKEN) {
      console.error('Missing Github_API_KEY in .env');
      return res.status(500).json({ success: false, message: 'Server configuration error - AI not available' });
    }

    const systemPrompt = `
You are an experienced career coach named "Pulse AI Coach".
You help job seekers with:
- Resume improvement
- Interview preparation
- Job search strategy
- Career path advice
- Salary negotiation
- Confidence building

Be encouraging, practical, honest, and concise.
Use bullet points when giving lists or tips.
Keep answers focused and actionable.
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending to GitHub Models:', { model: 'Grok-3-Mini', messageCount: messages.length });

    const response = await axios.post(
      GITHUB_MODELS_URL,
      {
        model: 'Grok-3-Mini',  // fallback model – if not available, try 'meta-llama-3.1-70b-instruct'
        messages,
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({
      success: true,
      reply: aiReply,
      role: 'assistant'
    });
  } catch (err: any) {
    console.error('AI Coach full error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers
    });

    let errorMessage = 'AI service error. Please try again later.';

    if (err.response?.status === 401) {
      errorMessage = 'Invalid GitHub token. Check your GITHUB_PAT in .env';
    } else if (err.response?.status === 429) {
      errorMessage = 'Rate limit reached on GitHub Models.';
    } else if (err.response?.data?.error?.message) {
      errorMessage = err.response.data.error.message;
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
};