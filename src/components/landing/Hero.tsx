
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-accent py-20 px-6">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mb-6">
          Elevate Employee Performance with Powerful Appraisal Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Streamline your performance management process with our comprehensive appraisal platform for managers, employees, and executives.
        </p>
        <Button onClick={() => navigate('/login')} size="lg">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
}
