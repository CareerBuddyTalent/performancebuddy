
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewTemplate } from "@/types/templates";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine, RotateCcw } from "lucide-react";

// Template version history type
interface TemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  name: string;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
}

interface TemplateVersionHistoryProps {
  templateId: string;
  versions: TemplateVersion[];
  onRestoreVersion: (version: TemplateVersion) => void;
}

export default function TemplateVersionHistory({
  templateId,
  versions,
  onRestoreVersion,
}: TemplateVersionHistoryProps) {
  // Sort versions by version number in descending order
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>
          Previous versions of this template
        </CardDescription>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No previous versions available</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date Modified</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVersions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>v{version.versionNumber}</TableCell>
                  <TableCell>{version.name}</TableCell>
                  <TableCell>{format(version.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell>{version.createdBy}</TableCell>
                  <TableCell>
                    {version.isActive ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Archived</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRestoreVersion(version)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ArrowDownToLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
