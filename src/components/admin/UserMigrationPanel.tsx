
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { runMigration } from '@/scripts/migrateUsersToClerk';

interface MigrationResult {
  success: boolean;
  email: string;
  clerkUserId?: string;
  error?: string;
}

export function UserMigrationPanel() {
  const [clerkSecretKey, setClerkSecretKey] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleMigration = async () => {
    if (!clerkSecretKey.trim()) {
      alert('Please enter your Clerk secret key');
      return;
    }

    setIsRunning(true);
    setShowResults(false);
    
    try {
      const migrationResults = await runMigration(clerkSecretKey);
      setResults(migrationResults);
      setShowResults(true);
    } catch (error: any) {
      alert(`Migration failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const successful = results.filter(r => r.success && !r.error?.includes('already exists'));
  const existing = results.filter(r => r.error?.includes('already exists'));
  const failed = results.filter(r => !r.success);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Migration Tool
          </CardTitle>
          <CardDescription>
            Migrate users from Supabase to Clerk authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This tool will migrate all users from your Supabase database to Clerk. 
              Make sure you have your Clerk secret key ready.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="clerkSecretKey">Clerk Secret Key</Label>
            <Input
              id="clerkSecretKey"
              type="password"
              placeholder="sk_test_..."
              value={clerkSecretKey}
              onChange={(e) => setClerkSecretKey(e.target.value)}
              disabled={isRunning}
            />
            <p className="text-sm text-muted-foreground">
              Get your secret key from the Clerk dashboard under API Keys
            </p>
          </div>

          <Button 
            onClick={handleMigration}
            disabled={isRunning || !clerkSecretKey.trim()}
            className="w-full"
          >
            {isRunning ? 'Migrating Users...' : 'Start Migration'}
          </Button>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Successfully Migrated</p>
                    <p className="text-2xl font-bold text-green-600">{successful.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Already Existed</p>
                    <p className="text-2xl font-bold text-blue-600">{existing.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{failed.length}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </CardContent>
              </Card>
            </div>

            {failed.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Failed Migrations:</h4>
                <div className="space-y-1">
                  {failed.map((result, index) => (
                    <div key={index} className="text-sm p-2 bg-red-50 rounded">
                      <span className="font-medium">{result.email}:</span> {result.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
