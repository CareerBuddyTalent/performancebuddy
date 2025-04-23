
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-primary text-primary-foreground py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your performance management?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of organizations using PerformPath to drive employee development and success.
        </p>
        <Button onClick={() => navigate('/login')} size="lg" variant="secondary">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
}
