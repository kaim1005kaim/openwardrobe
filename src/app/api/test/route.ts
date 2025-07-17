import { NextRequest, NextResponse } from 'next/server';
import ky from 'ky';

const API_URL = process.env.IMAGINE_API_URL || 'https://cl.imagineapi.dev';
const API_TOKEN = process.env.IMAGINE_API_TOKEN || '__DUMMY_IMAGINE_TOKEN__';

export async function GET(req: NextRequest) {
  try {
    // Test API connectivity
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        API_URL,
        hasToken: !!API_TOKEN && API_TOKEN !== '__DUMMY_IMAGINE_TOKEN__',
        tokenLength: API_TOKEN ? API_TOKEN.length : 0,
        tokenStart: API_TOKEN ? API_TOKEN.substring(0, 10) + '...' : 'none'
      },
      tests: {} as any
    };

    // Test 1: API Status endpoint (system health)
    try {
      const response = await ky.get(`${API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        },
        timeout: 10000,
        retry: 0
      });
      
      const statusData = await response.json() as any;
      testResults.tests.systemStatus = {
        status: 'success',
        httpStatus: response.status,
        systemStatus: statusData.status,
        healthyIntegrations: statusData.data?.healthy_integrations_count,
        totalIntegrations: statusData.data?.total_integrations_count,
        healthPercentage: statusData.data?.healthy_percentage
      };
    } catch (error) {
      testResults.tests.systemStatus = {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 2: Authentication test (if token available)
    if (API_TOKEN && API_TOKEN !== '__DUMMY_IMAGINE_TOKEN__') {
      try {
        const response = await ky.get(`${API_URL}/items/images/`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          },
          timeout: 10000,
          retry: 0
        });
        
        const data = await response.json() as any;
        testResults.tests.authTest = {
          status: 'success',
          httpStatus: response.status,
          message: 'Authentication successful',
          imageCount: data.data ? data.data.length : 0,
          recentImages: data.data ? data.data.slice(0, 3).map((img: any) => ({
            id: img.id,
            status: img.status,
            url: img.url,
            upscaled_urls: img.upscaled_urls,
            prompt: img.prompt?.substring(0, 50) + '...'
          })) : []
        };
      } catch (error) {
        const httpError = error as any;
        testResults.tests.authTest = {
          status: 'failed',
          httpStatus: httpError.response?.status,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } else {
      testResults.tests.authTest = {
        status: 'skipped',
        message: 'No API token configured'
      };
    }

    // Test 3: Check specific image status (if found in Discord)
    try {
      const specificImageId = 'TEX7EmAcegu0k_SxVdvwo'; // ID from Discord screenshot
      const response = await ky.get(`${API_URL}/items/images/${specificImageId}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        },
        timeout: 10000,
        retry: 0
      });
      
      const data = await response.json() as any;
      testResults.tests.specificImageTest = {
        status: 'success',
        httpStatus: response.status,
        imageData: {
          id: data.data.id,
          status: data.data.status,
          url: data.data.url,
          upscaled_urls: data.data.upscaled_urls,
          progress: data.data.progress,
          prompt: data.data.prompt?.substring(0, 100) + '...'
        }
      };
    } catch (error) {
      const httpError = error as any;
      testResults.tests.specificImageTest = {
        status: 'failed',
        httpStatus: httpError.response?.status,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return NextResponse.json(testResults);
  } catch (error) {
    console.error('Test endpoint error:', error);
    
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}