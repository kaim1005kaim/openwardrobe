import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if API token is properly configured
    if (!API_TOKEN || API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
      return NextResponse.json({ 
        error: 'ImagineAPI token not configured. Please set IMAGINE_API_TOKEN environment variable.' 
      }, { status: 500 });
    }

    // Real API call
    const response = await ky.get(`${API_URL}/items/images/${id}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
      timeout: 30000
    }).json<{ data: any }>();

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to get image status:', error);
    return NextResponse.json(
      { error: 'Failed to get image status' },
      { status: 500 }
    );
  }
}