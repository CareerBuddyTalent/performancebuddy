
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      // Migration functionality has been removed since we're using Supabase auth
      alert('Migration functionality has been removed. Please use Supabase authentication.');
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
            User Migration Tool (Deprecated)
          </CardTitle>
          <CardDescription>
            This tool is no longer available as we've migrated to Supabase authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The migration tool has been removed. Please use Supabase authentication instead.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
