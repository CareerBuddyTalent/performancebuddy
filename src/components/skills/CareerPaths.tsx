
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CareerPaths() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Development Paths</CardTitle>
        <CardDescription>View and manage career progression paths within the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 py-4">
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="text-lg font-medium">Technical Track</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              {["Junior Developer", "Developer", "Senior Developer", "Principal Engineer", "CTO"].map((role, index) => (
                <div key={index} className="relative pl-10 pb-8">
                  <div className="absolute left-2.5 w-5 h-5 bg-primary rounded-full"></div>
                  <h4 className="font-medium">{role}</h4>
                  <p className="text-sm text-muted-foreground">
                    {index + 1}-{index + 3} years
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="text-lg font-medium">Management Track</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              {["Team Lead", "Engineering Manager", "Director of Engineering", "VP of Engineering", "CTO"].map((role, index) => (
                <div key={index} className="relative pl-10 pb-8">
                  <div className="absolute left-2.5 w-5 h-5 bg-secondary rounded-full"></div>
                  <h4 className="font-medium">{role}</h4>
                  <p className="text-sm text-muted-foreground">
                    {index + 2}-{index + 4} years
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="text-lg font-medium">Skills Required</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Technical Expertise</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Junior</span>
                    <div className="w-32 bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Senior</span>
                    <div className="w-32 bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Principal</span>
                    <div className="w-32 bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Leadership</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Junior</span>
                    <div className="w-32 bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manager</span>
                    <div className="w-32 bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Director</span>
                    <div className="w-32 bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
