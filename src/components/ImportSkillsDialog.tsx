
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileSpreadsheet, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skill, SkillLevel } from "@/types";
import { toast } from "@/components/ui/sonner";

interface ImportSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (skills: Skill[]) => void;
}

export function ImportSkillsDialog({ open, onOpenChange, onImportComplete }: ImportSkillsDialogProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<"csv" | "sheet">("csv");
  const [sheetUrl, setSheetUrl] = useState("");
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [parsedSkills, setParsedSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importStep, setImportStep] = useState<"upload" | "preview" | "mapping">("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setError(null);
      readCsvFile(e.target.files[0]);
    }
  };

  const readCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
        );
        
        // Filter out empty rows
        const nonEmptyRows = rows.filter(row => row.some(cell => cell !== ''));
        
        if (nonEmptyRows.length < 2) {
          setError("The CSV file must contain at least a header row and one data row");
          return;
        }
        
        setPreviewData(nonEmptyRows);
        setImportStep("preview");
      } catch (err) {
        setError("Failed to parse CSV file. Please check file format.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const parseSkillsFromCsv = () => {
    try {
      if (previewData.length < 2) {
        setError("Not enough data to import");
        return;
      }

      const headers = previewData[0];
      const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('skill'));
      const descIndex = headers.findIndex(h => h.toLowerCase().includes('desc'));
      const catIndex = headers.findIndex(h => h.toLowerCase().includes('cat'));
      
      if (nameIndex === -1) {
        setError("Required column 'Name' or 'Skill' not found in CSV");
        return;
      }

      const skills: Skill[] = [];
      let nextId = 100; // Start IDs from a high number to avoid conflicts

      for (let i = 1; i < previewData.length; i++) {
        const row = previewData[i];
        if (row.length <= nameIndex || !row[nameIndex]) continue;

        const skill: Skill = {
          id: (nextId++).toString(),
          name: row[nameIndex],
          description: catIndex !== -1 ? row[descIndex] || `Skill in ${row[nameIndex]}` : `Skill in ${row[nameIndex]}`,
          category: catIndex !== -1 ? row[catIndex] || "General" : "General",
          levels: [
            {
              level: 1,
              description: "Basic understanding",
              expectations: ["Basic knowledge", "Foundational skills"]
            },
            {
              level: 2,
              description: "Practical application",
              expectations: ["Can apply in simple scenarios", "Requires some guidance"]
            },
            {
              level: 3,
              description: "Advanced implementation",
              expectations: ["Independently applies in complex scenarios", "Can guide others"]
            },
            {
              level: 4,
              description: "Expert mastery",
              expectations: ["Deep expertise", "Strategic application", "Thought leadership"]
            }
          ]
        };
        
        // Look for level data in the CSV
        for (let lvl = 1; lvl <= 5; lvl++) {
          const levelDescIndex = headers.findIndex(h => h.toLowerCase().includes(`level ${lvl}`) || h.toLowerCase().includes(`l${lvl}`));
          if (levelDescIndex !== -1 && row[levelDescIndex]) {
            // If level exists, add or update it
            const levelObj = skill.levels.find(l => l.level === lvl);
            if (levelObj) {
              levelObj.description = row[levelDescIndex];
            } else {
              skill.levels.push({
                level: lvl,
                description: row[levelDescIndex],
                expectations: [`Level ${lvl} proficiency in ${skill.name}`]
              });
            }
          }
        }
        
        skills.push(skill);
      }

      if (skills.length === 0) {
        setError("No valid skills found in the CSV");
        return;
      }

      setParsedSkills(skills);
      setError(null);
      setImportStep("mapping");
    } catch (err) {
      setError("Failed to parse skills from CSV data");
      console.error(err);
    }
  };

  const handleImport = () => {
    if (parsedSkills.length === 0) {
      setError("No skills to import");
      return;
    }

    try {
      onImportComplete(parsedSkills);
      toast.success(`Successfully imported ${parsedSkills.length} skills`);
      resetImport();
      onOpenChange(false);
    } catch (err) {
      setError("Failed to import skills");
      console.error(err);
    }
  };

  const resetImport = () => {
    setCsvFile(null);
    setSheetUrl("");
    setPreviewData([]);
    setParsedSkills([]);
    setError(null);
    setImportStep("upload");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import Skills & Competencies</DialogTitle>
          <DialogDescription>
            Import skills and competency frameworks from CSV files or Google Sheets
          </DialogDescription>
        </DialogHeader>

        <Tabs value={importType} onValueChange={(v) => setImportType(v as "csv" | "sheet")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV File</TabsTrigger>
            <TabsTrigger value="sheet">Google Sheet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4">
            {importStep === "upload" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-10">
                  <FileSpreadsheet className="w-10 h-10 text-muted-foreground mb-4" />
                  <div className="text-center space-y-2 mb-4">
                    <h3 className="font-medium">Upload CSV File</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Your CSV should contain columns for skill name, description, category, 
                      and optionally level descriptions (Level 1, Level 2, etc.)
                    </p>
                  </div>
                  <Input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                    className="max-w-xs"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">CSV Format Example:</p>
                  <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                    Name,Description,Category,Level 1,Level 2,Level 3{"\n"}
                    JavaScript,JavaScript programming,Technical,Basic syntax,DOM manipulation,Advanced patterns{"\n"}
                    Leadership,Team leadership skills,Soft Skills,Lead small teams,Develop strategies,Executive leadership
                  </pre>
                </div>
              </div>
            )}

            {importStep === "preview" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview Import Data</h3>
                <ScrollArea className="h-60 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {previewData[0]?.map((header, i) => (
                          <TableHead key={i}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(1).map((row, i) => (
                        <TableRow key={i}>
                          {row.map((cell, j) => (
                            <TableCell key={j}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetImport}>Back</Button>
                  <Button onClick={parseSkillsFromCsv}>Continue</Button>
                </div>
              </div>
            )}

            {importStep === "mapping" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Review Skills for Import</h3>
                <ScrollArea className="h-60 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Levels</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedSkills.map((skill) => (
                        <TableRow key={skill.id}>
                          <TableCell className="font-medium">{skill.name}</TableCell>
                          <TableCell>{skill.category}</TableCell>
                          <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                          <TableCell>{skill.levels.length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setImportStep("preview")}>Back</Button>
                  <Button onClick={handleImport}>Import {parsedSkills.length} Skills</Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sheet" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-10">
                <FileSpreadsheet className="w-10 h-10 text-muted-foreground mb-4" />
                <div className="text-center space-y-2 mb-4">
                  <h3 className="font-medium">Connect Google Sheet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Enter a public Google Sheet URL that contains your skills data
                  </p>
                </div>
                <div className="flex w-full max-w-md space-x-2">
                  <Input 
                    type="url" 
                    placeholder="https://docs.google.com/spreadsheets/d/..." 
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button disabled type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Google Sheets import is coming soon. Please use CSV import for now.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
