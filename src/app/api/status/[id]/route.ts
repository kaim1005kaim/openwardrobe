import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';

// Mock data storage for development
const mockData = new Map<string, any>();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Mock implementation for development
    if (API_TOKEN === '__DUMMY_IMAGINE_TOKEN__') {
      // Initialize mock data if not exists
      if (!mockData.has(id)) {
        mockData.set(id, {
          id,
          status: 'processing',
          progress: 0,
          startTime: Date.now()
        });
        
        // Simulate processing
        setTimeout(() => {
          const data = mockData.get(id);
          if (data) {
            data.status = 'completed';
            data.progress = 100;
            data.url = `https://picsum.photos/1024/1024?random=${Date.now()}`;
            data.thumbnail = `https://picsum.photos/512/512?random=${Date.now()}`;
            mockData.set(id, data);
          }
        }, 5000 + Math.random() * 5000); // 5-10 seconds
      }

      const data = mockData.get(id);
      
      // Update progress
      if (data && data.status === 'processing') {
        const elapsed = Date.now() - data.startTime;
        data.progress = Math.min(90, (elapsed / 10000) * 100);
        mockData.set(id, data);
      }

      return NextResponse.json({ data });
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