import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Diagnostics = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const runFullDiagnostic = async () => {
    setTesting(true);
    setResults(null);

    const diagnostic: any = {
      timestamp: new Date().toISOString(),
      environment: {
        mode: import.meta.env.MODE,
        dev: import.meta.env.DEV,
        prod: import.meta.env.PROD,
      },
      envVars: {
        url: {
          exists: !!SUPABASE_URL,
          value: SUPABASE_URL || 'NOT SET',
          length: SUPABASE_URL?.length || 0,
          isValid: SUPABASE_URL?.startsWith('https://') && SUPABASE_URL?.includes('.supabase.co'),
        },
        key: {
          exists: !!SUPABASE_KEY,
          value: SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 20)}...` : 'NOT SET',
          length: SUPABASE_KEY?.length || 0,
          startsWithEyJ: SUPABASE_KEY?.startsWith('eyJ') || false,
        },
      },
      configuration: {
        isConfigured: isSupabaseConfigured(),
      },
      connection: null as any,
      queries: {
        products: null as any,
        adminSettings: null as any,
      },
    };

    try {
      // Test 1: Basic connection
      console.log('🔍 Testing Supabase connection...');
      const { data: connectionData, error: connectionError } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      diagnostic.connection = {
        success: !connectionError,
        error: connectionError ? {
          message: connectionError.message,
          code: connectionError.code,
          details: connectionError.details,
          hint: connectionError.hint,
        } : null,
        data: connectionData,
      };

      // Test 2: Products query
      if (!connectionError) {
        console.log('🔍 Testing products query...');
        const { data: productsData, error: productsError, count } = await supabase
          .from('products')
          .select('*', { count: 'exact' });

        diagnostic.queries.products = {
          success: !productsError,
          error: productsError ? {
            message: productsError.message,
            code: productsError.code,
          } : null,
          count: count || productsData?.length || 0,
          sample: productsData?.slice(0, 2) || [],
        };
      }

      // Test 3: Admin settings query
      console.log('🔍 Testing admin settings query...');
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      diagnostic.queries.adminSettings = {
        success: !settingsError,
        error: settingsError ? {
          message: settingsError.message,
          code: settingsError.code,
        } : null,
        data: settingsData ? {
          id: settingsData.id,
          hasPasswordHash: !!settingsData.admin_password_hash,
          passwordHashLength: settingsData.admin_password_hash?.length || 0,
        } : null,
      };

    } catch (error: any) {
      diagnostic.error = {
        message: error.message,
        stack: error.stack,
      };
    }

    setResults(diagnostic);
    setTesting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-2">Supabase Diagnostics</h1>
          <p className="text-muted-foreground">Complete connection and configuration test</p>
        </div>

        <Button onClick={runFullDiagnostic} disabled={testing} className="w-full" size="lg">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Full Diagnostic'
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>Check if variables are set correctly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">VITE_SUPABASE_URL</span>
                    {results.envVars.url.exists ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="bg-muted p-2 rounded text-sm font-mono break-all">
                    {results.envVars.url.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Length: {results.envVars.url.length} | 
                    Valid format: {results.envVars.url.isValid ? '✅' : '❌'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">VITE_SUPABASE_PUBLISHABLE_KEY</span>
                    {results.envVars.key.exists ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="bg-muted p-2 rounded text-sm font-mono break-all flex items-center justify-between">
                    <span>{results.envVars.key.value}</span>
                    {results.envVars.key.exists && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(SUPABASE_KEY || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Length: {results.envVars.key.length} | 
                    Starts with eyJ: {results.envVars.key.startsWithEyJ ? '✅' : '❌'}
                  </div>
                </div>

                {(!results.envVars.url.exists || !results.envVars.key.exists) && (
                  <Alert variant="destructive">
                    <AlertTitle>Missing Environment Variables</AlertTitle>
                    <AlertDescription>
                      Set these in Vercel Dashboard → Settings → Environment Variables
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Configuration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Supabase Configured</span>
                  {results.configuration.isConfigured ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Mode: {results.environment.mode} | 
                  Dev: {results.environment.dev ? 'Yes' : 'No'} | 
                  Prod: {results.environment.prod ? 'Yes' : 'No'}
                </div>
              </CardContent>
            </Card>

            {/* Connection Test */}
            {results.connection && (
              <Card>
                <CardHeader>
                  <CardTitle>Database Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.connection.success ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Connection Successful</AlertTitle>
                      <AlertDescription>
                        Successfully connected to Supabase database
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Connection Failed</AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p><strong>Error:</strong> {results.connection.error?.message}</p>
                        {results.connection.error?.code && (
                          <p><strong>Code:</strong> {results.connection.error.code}</p>
                        )}
                        {results.connection.error?.hint && (
                          <p><strong>Hint:</strong> {results.connection.error.hint}</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Products Query */}
            {results.queries.products && (
              <Card>
                <CardHeader>
                  <CardTitle>Products Query</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.queries.products.success ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Query Successful</AlertTitle>
                      <AlertDescription>
                        Found {results.queries.products.count} product(s) in database
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Query Failed</AlertTitle>
                      <AlertDescription>
                        <p><strong>Error:</strong> {results.queries.products.error?.message}</p>
                        {results.queries.products.error?.code && (
                          <p><strong>Code:</strong> {results.queries.products.error.code}</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Admin Settings Query */}
            {results.queries.adminSettings && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings Query</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.queries.adminSettings.success ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Query Successful</AlertTitle>
                      <AlertDescription>
                        Admin settings found. Password hash length: {results.queries.adminSettings.data?.passwordHashLength}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Query Failed</AlertTitle>
                      <AlertDescription>
                        <p><strong>Error:</strong> {results.queries.adminSettings.error?.message}</p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Full Results JSON */}
            <Card>
              <CardHeader>
                <CardTitle>Full Diagnostic Results</CardTitle>
                <CardDescription>Copy this to share for debugging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded text-xs font-mono overflow-auto max-h-96">
                  <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full Results
                </Button>
              </CardContent>
            </Card>

            {/* Help Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Vercel Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Supabase Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnostics;

