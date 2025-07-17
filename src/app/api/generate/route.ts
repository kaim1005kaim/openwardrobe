import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';
const API_MODEL = process.env.IMAGINE_API_MODEL || 'MJ';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, ref } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check if API token is properly configured
    if (!API_TOKEN || API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
      return NextResponse.json({ 
        error: 'ImagineAPI token not configured. Please set IMAGINE_API_TOKEN environment variable.' 
      }, { status: 500 });
    }

    // Real API call
    const response = await ky.post(`${API_URL}/items/images`, {
      json: {
        prompt,
        ref,
        model: API_MODEL
      },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }).json<{ data: { id: string } }>();

    return NextResponse.json(response);
  } catch (error) {
    console.error('Image generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}