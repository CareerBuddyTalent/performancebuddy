
import { useState } from "react";
import { Survey } from "@/types";
import SurveyCard from "@/components/SurveyCard";
import SurveyPagination from "./SurveyPagination";

interface SurveyGridProps {
  surveys: Survey[];
  emptyMessage: string;
}

export default function SurveyGrid({ surveys, emptyMessage }: SurveyGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const surveysPerPage = 6;
  
  if (surveys.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(surveys.length / surveysPerPage);
  const startIndex = (currentPage - 1) * surveysPerPage;
  const endIndex = startIndex + surveysPerPage;
  const currentSurveys = surveys.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentSurveys.map(survey => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <SurveyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
