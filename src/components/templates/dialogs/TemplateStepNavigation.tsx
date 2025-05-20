
import { Button } from "@/components/ui/button";

interface TemplateStepNavigationProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueText?: string;
  backText?: string;
  showBackButton?: boolean;
}

export default function TemplateStepNavigation({
  onBack,
  onContinue,
  continueText = "Continue",
  backText = "Back",
  showBackButton = true
}: TemplateStepNavigationProps) {
  return (
    <div className="flex justify-between pt-4">
      {showBackButton && (
        <Button type="button" variant="outline" onClick={onBack}>
          {backText}
        </Button>
      )}
      {onContinue && (
        <Button onClick={onContinue} className={!showBackButton ? "ml-auto" : ""}>
          {continueText}
        </Button>
      )}
    </div>
  );
}
