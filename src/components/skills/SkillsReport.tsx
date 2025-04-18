
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import SkillDistributionChart from "@/components/analytics/SkillDistributionChart";
import { initialSkills } from "@/data/reviewSkillsData";

export function SkillsReport() {
  // Filter active skills only
  const activeSkills = initialSkills.filter(skill => skill.isActive);
  
  const technicalSkills = activeSkills.filter(skill => skill.category === "technical");
  const softSkills = activeSkills.filter(skill => skill.category === "soft");
  
  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log("Exporting PDF...");
  };

  const handleDownloadCSV = () => {
    // TODO: Implement CSV download functionality
    console.log("Downloading CSV...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skills Report</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of organization-wide skills and competencies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Skills Distribution */}
        <SkillDistributionChart />
        
        {/* Skills Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium">Total Active Skills</dt>
                <dd>{activeSkills.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Technical Skills</dt>
                <dd>{technicalSkills.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Soft Skills</dt>
                <dd>{softSkills.length}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Skills Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {technicalSkills.map(skill => (
                <li key={skill.id} className="text-sm">
                  {skill.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Soft Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {softSkills.map(skill => (
                <li key={skill.id} className="text-sm">
                  {skill.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
