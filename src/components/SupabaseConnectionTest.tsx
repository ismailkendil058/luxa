import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export const SupabaseConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    envVars: { url: boolean; key: boolean };
    connection: boolean | null;
    adminSettings: boolean | null;
    error: string | null;
  } | null>(null);

  const runTest = async () => {
    setTesting(true);
    setResults(null);

    const testResults = {
      envVars: {
        url: !!import.meta.env.VITE_SUPABASE_URL,
        key: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      connection: null as boolean | null,
      adminSettings: null as boolean | null,
      error: null as string | null,
    };

    try {
      // Test 1: Check environment variables
      console.log('Environment Variables:');
      console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
      console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing');
      console.log('isSupabaseConfigured():', isSupabaseConfigured());

      // Test 2: Try to connect to Supabase
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase environment variables are not configured');
      }

      // Test 3: Try a simple query
      const { data: connectionData, error: connectionError } = await supabase
        .from('admin_settings')
        .select('id')
        .limit(1);

      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`);
      }

      testResults.connection = true;

      // Test 4: Try to fetch admin settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (settingsError) {
        throw new Error(`Admin settings query failed: ${settingsError.message}`);
      }

      testResults.adminSettings = true;

      console.log('✅ All tests passed!');
      console.log('Admin settings data:', settingsData);

    } catch (error: any) {
      testResults.error = error.message || 'Unknown error';
      console.error('Test failed:', error);
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Diagnostic</CardTitle>
        <CardDescription>
          Test your Supabase connection and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTest} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Run Connection Test'
          )}
        </Button>

        {results && (
          <div className="space-y-3">
            {/* Environment Variables */}
            <Alert>
              <AlertTitle>Environment Variables</AlertTitle>
              <AlertDescription className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  {results.envVars.url ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>VITE_SUPABASE_URL: {results.envVars.url ? 'Set' : 'Missing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {results.envVars.key ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>VITE_SUPABASE_PUBLISHABLE_KEY: {results.envVars.key ? 'Set' : 'Missing'}</span>
                </div>
                {(!results.envVars.url || !results.envVars.key) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Set these in Vercel Dashboard → Settings → Environment Variables
                  </p>
                )}
              </AlertDescription>
            </Alert>

            {/* Connection Test */}
            {results.connection !== null && (
              <Alert variant={results.connection ? 'default' : 'destructive'}>
                <AlertTitle>Database Connection</AlertTitle>
                <AlertDescription className="flex items-center gap-2 mt-2">
                  {results.connection ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Successfully connected to Supabase</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>Failed to connect</span>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Admin Settings Test */}
            {results.adminSettings !== null && (
              <Alert variant={results.adminSettings ? 'default' : 'destructive'}>
                <AlertTitle>Admin Settings Query</AlertTitle>
                <AlertDescription className="flex items-center gap-2 mt-2">
                  {results.adminSettings ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Successfully fetched admin settings</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>Failed to fetch admin settings</span>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {results.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="mt-2">
                  {results.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {results.connection && results.adminSettings && !results.error && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>All Tests Passed!</AlertTitle>
                <AlertDescription className="mt-2">
                  Your Supabase connection is working correctly. If login still doesn't work, check the password hash in the database.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p><strong>Debug Info:</strong></p>
          <p>URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p>Key: {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? `${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.substring(0, 20)}...` : 'Not set'}</p>
          <p>Configured: {isSupabaseConfigured() ? 'Yes' : 'No'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

