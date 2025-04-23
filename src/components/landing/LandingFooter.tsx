
export default function LandingFooter() {
  return (
    <footer className="bg-muted py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <img 
            src="/lovable-uploads/5f7f5cab-6e48-4d4e-b4a2-edee8cc1cbc4.png" 
            alt="CareerBuddy" 
            className="h-6 mb-4 md:mb-0"
          />
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerBuddy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
