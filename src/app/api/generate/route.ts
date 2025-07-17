import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';
const API_MODEL = process.env.IMAGINE_API_MODEL || 'MJ';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, ref } = body;

    console.log('🔍 API Request received:', { prompt, ref });
    console.log('🔍 Environment variables:', { 
      API_URL, 
      hasToken: !!API_TOKEN && API_TOKEN !== '__DUMMY_IMAGINE_TOKEN__',
      API_MODEL 
    });

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check if API token is properly configured
    if (!API_TOKEN || API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
      return NextResponse.json({ 
        error: 'ImagineAPI token not configured. Please set IMAGINE_API_TOKEN environment variable.' 
      }, { status: 500 });
    }

    // Real API call (based on ImagineAPI documentation)
    const requestPayload = {
      prompt,
      model: API_MODEL,
      ...(ref && { ref })
    };

    console.log('🔍 API Request payload:', requestPayload);

    const response = await ky.post(`${API_URL}/items/images/`, {
      json: requestPayload,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }).json<{ data: { id: string } }>();

    console.log('✅ Image generation request successful:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Image generation failed:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Handle specific HTTP errors
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as any;
      console.error('HTTP Status:', httpError.response?.status);
      
      let responseText = 'Unable to read response';
      try {
        responseText = await httpError.response?.text?.();
        console.error('HTTP Response:', responseText);
      } catch (e) {
        console.error('Failed to read response text:', e);
      }
      
      return NextResponse.json(
        { 
          error: 'API request failed',
          details: `HTTP ${httpError.response?.status}: Request failed with status code ${httpError.response?.status} ${httpError.response?.statusText || 'Unknown'}: POST ${API_URL}/items/images/`,
          apiUrl: API_URL,
          hasToken: !!API_TOKEN && API_TOKEN !== '__DUMMY_IMAGINE_TOKEN__',
          responseText: responseText
        },
        { status: httpError.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiUrl: API_URL,
        hasToken: !!API_TOKEN && API_TOKEN !== '__DUMMY_IMAGINE_TOKEN__'
      },
      { status: 500 }
    );
  }
}