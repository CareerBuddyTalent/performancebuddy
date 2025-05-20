
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Plus, User, MessageSquare, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import OneOnOneCheckIns from "@/components/line-manager/OneOnOneCheckIns";
import ContinuousFeedback from "@/components/line-manager/ContinuousFeedback";
import PeerReviews from "@/components/line-manager/PeerReviews";
import PIPManagement from "@/components/line-manager/PIPManagement";
import LineManagerStats from "@/components/line-manager/LineManagerStats";
import CreateOneOnOneDialog from "@/components/line-manager/CreateOneOnOneDialog";
import ProvideFeedbackDialog from "@/components/line-manager/ProvideFeedbackDialog";
import CreatePeerReviewDialog from "@/components/line-manager/CreatePeerReviewDialog";
import CreatePIPDialog from "@/components/line-manager/CreatePIPDialog";

export default function LineManagerDashboard() {
  const [activeTab, setActiveTab] = useState("one-on-ones");
  const [isCreateOneOnOneOpen, setIsCreateOneOnOneOpen] = useState(false);
  const [isProvideFeedbackOpen, setIsProvideFeedbackOpen] = useState(false);
  const [isCreatePeerReviewOpen, setIsCreatePeerReviewOpen] = useState(false);
  const [isCreatePIPOpen, setIsCreatePIPOpen] = useState(false);
  const { user } = useAuth();
  
  if (!user) return null;

  const handlePrimaryAction = () => {
    switch (activeTab) {
      case "one-on-ones":
        setIsCreateOneOnOneOpen(true);
        break;
      case "feedback":
        setIsProvideFeedbackOpen(true);
        break;
      case "peer-reviews":
        setIsCreatePeerReviewOpen(true);
        break;
      case "pip":
        setIsCreatePIPOpen(true);
        break;
      default:
        break;
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "one-on-ones":
        return "Schedule 1:1";
      case "feedback":
        return "Provide Feedback";
      case "peer-reviews":
        return "Create Peer Review";
      case "pip":
        return "Start PIP";
      default:
        return "Create New";
    }
  };

  const getButtonIcon = () => {
    switch (activeTab) {
      case "one-on-ones":
        return <User className="h-4 w-4 mr-2" />;
      case "feedback":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "peer-reviews":
        return <UserCheck className="h-4 w-4 mr-2" />;
      case "pip":
        return <AlertCircle className="h-4 w-4 mr-2" />;
      default:
        return <Plus className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Line Manager Dashboard</h1>
        <Button onClick={handlePrimaryAction}>
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </div>

      <LineManagerStats />

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="one-on-ones">1:1 Check-Ins</TabsTrigger>
            <TabsTrigger value="feedback">Continuous Feedback</TabsTrigger>
            <TabsTrigger value="peer-reviews">Peer Reviews</TabsTrigger>
            <TabsTrigger value="pip">Probation & PIP</TabsTrigger>
          </TabsList>

          <TabsContent value="one-on-ones">
            <OneOnOneCheckIns />
          </TabsContent>

          <TabsContent value="feedback">
            <ContinuousFeedback />
          </TabsContent>

          <TabsContent value="peer-reviews">
            <PeerReviews />
          </TabsContent>

          <TabsContent value="pip">
            <PIPManagement />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateOneOnOneDialog 
        open={isCreateOneOnOneOpen} 
        onOpenChange={setIsCreateOneOnOneOpen} 
        onSchedule={(meeting) => {
          toast.success("1:1 meeting scheduled successfully");
          setIsCreateOneOnOneOpen(false);
        }}
      />

      <ProvideFeedbackDialog
        open={isProvideFeedbackOpen}
        onOpenChange={setIsProvideFeedbackOpen}
        onSubmit={(feedback) => {
          toast.success("Feedback provided successfully");
          setIsProvideFeedbackOpen(false);
        }}
      />

      <CreatePeerReviewDialog
        open={isCreatePeerReviewOpen}
        onOpenChange={setIsCreatePeerReviewOpen}
        onSubmit={(review) => {
          toast.success("Peer review requests sent successfully");
          setIsCreatePeerReviewOpen(false);
        }}
      />

      <CreatePIPDialog
        open={isCreatePIPOpen}
        onOpenChange={setIsCreatePIPOpen}
        onSubmit={(pip) => {
          toast.success("PIP initiated successfully");
          setIsCreatePIPOpen(false);
        }}
      />
    </div>
  );
}
