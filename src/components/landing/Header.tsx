
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-background py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/5f7f5cab-6e48-4d4e-b4a2-edee8cc1cbc4.png" 
              alt="CareerBuddy" 
              className="h-8"
            />
          </div>
          <div>
            <Button onClick={() => navigate('/login')} variant="outline" className="mr-4">
              Sign In
            </Button>
            <Button onClick={() => navigate('/login')}>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
