import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let id: string = 'unknown';
  
  try {
    const params = await context.params;
    id = params.id;

    // Check if API token is properly configured
    if (!API_TOKEN || API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
      return NextResponse.json({ 
        error: 'ImagineAPI token not configured. Please set IMAGINE_API_TOKEN environment variable.' 
      }, { status: 500 });
    }

    // Real API call (based on ImagineAPI documentation)
    const response = await ky.get(`${API_URL}/items/images/${id}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
      timeout: 30000
    }).json<{ data: any }>();

    console.log(`✅ Status check successful for ${id}:`, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(`❌ Status check failed for ${id || 'unknown'}:`, error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    // Handle specific HTTP errors
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as any;
      console.error('HTTP Status:', httpError.response?.status);
      console.error('HTTP Response:', await httpError.response?.text?.());
      
      return NextResponse.json(
        { 
          error: 'API status check failed',
          details: `HTTP ${httpError.response?.status}: ${httpError.message}`,
          imageId: id || 'unknown',
          apiUrl: API_URL
        },
        { status: httpError.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to get image status',
        details: error instanceof Error ? error.message : 'Unknown error',
        imageId: id || 'unknown',
        apiUrl: API_URL
      },
      { status: 500 }
    );
  }
}