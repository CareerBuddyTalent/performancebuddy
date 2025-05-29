
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PerformanceBuddy! 🎉',
    description: 'Let\'s take a quick tour to help you get started with managing your performance and goals.',
    target: '',
    position: 'bottom'
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'This is your main dashboard where you can see an overview of your performance, goals, and recent activity.',
    target: '[data-tour="dashboard"]',
    position: 'bottom'
  },
  {
    id: 'navigation',
    title: 'Navigation Menu',
    description: 'Use this sidebar to navigate between different sections like Performance, Goals, Skills, and Reviews.',
    target: '[data-tour="sidebar"]',
    position: 'right'
  },
  {
    id: 'notifications',
    title: 'Stay Updated',
    description: 'Click here to view your notifications about review deadlines, feedback, and important updates.',
    target: '[data-tour="notifications"]',
    position: 'bottom'
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Access your profile settings, preferences, and account information from this menu.',
    target: '[data-tour="profile"]',
    position: 'bottom'
  }
];

export function OnboardingTour() {
  const { user } = useSupabaseAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem(`onboarding-completed-${user?.id}`);
    if (!completed && user) {
      setTimeout(() => setIsVisible(true), 1000); // Delay to let page load
    } else {
      setHasCompletedOnboarding(true);
    }
  }, [user]);

  const currentStepData = onboardingSteps[currentStep];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    setIsVisible(false);
    setHasCompletedOnboarding(true);
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
    }
  };

  const skipTour = () => {
    completeOnboarding();
  };

  if (!isVisible || hasCompletedOnboarding) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Tour Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {onboardingSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {currentStepData.title}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {currentStepData.description}
              </p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-muted-foreground"
                  >
                    Skip Tour
                  </Button>
                  
                  <Button
                    onClick={nextStep}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      <>
                        <Check className="h-4 w-4" />
                        Finish
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
