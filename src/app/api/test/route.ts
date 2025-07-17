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

    // Test 1: Basic API endpoint accessibility
    try {
      const response = await ky.get(`${API_URL}/health`, {
        timeout: 10000,
        retry: 0
      });
      
      testResults.tests.healthCheck = {
        status: 'success',
        httpStatus: response.status,
        response: await response.text()
      };
    } catch (error) {
      testResults.tests.healthCheck = {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 2: Authentication test (if token available)
    if (API_TOKEN && API_TOKEN !== '__DUMMY_IMAGINE_TOKEN__') {
      try {
        const response = await ky.get(`${API_URL}/items/images`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          },
          timeout: 10000,
          retry: 0
        });
        
        testResults.tests.authTest = {
          status: 'success',
          httpStatus: response.status,
          message: 'Authentication successful'
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