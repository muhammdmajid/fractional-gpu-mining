"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/primitives/avatar";
import {
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  MessageSquare,
  Briefcase,
  MoreVertical,
  Eye,
  Edit,
} from "lucide-react";
import { FC, JSX, useState } from "react";
import { Investment } from "@/types/mining-plans";
import RequestReviewDialog from "./request-review-dialog";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/primitives/dropdown-menu";
import InvestmentDetailDialog from "./investment-detail-dialog";

interface AllPlansProps {
  investments: Investment[];
  currentInvestmentPlan: Investment | null;
  setCurrentInvestmentPlan: (investment: Investment | null) => void;
}

export const statusConfig: Record<
  string,
  {
    label: string;
    icon: JSX.Element;
    variant: "default" | "secondary" | "destructive" | "outline";
    colorClass: string;
  }
> = {
  active: {
    label: "Active",
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
    variant: "default",
    colorClass:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="w-4 h-4 mr-1" />,
    variant: "secondary",
    colorClass:
      "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-300",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-4 h-4 mr-1" />,
    variant: "destructive",
    colorClass:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-300",
  },
  canceled: {
    label: "Canceled",
    icon: <Ban className="w-4 h-4 mr-1" />,
    variant: "outline",
    colorClass:
      "bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-300",
  },
};

const AllPlans: FC<AllPlansProps> = ({
  investments,
  currentInvestmentPlan,
  setCurrentInvestmentPlan,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);

  const handleRequestReview = (investment: Investment) => {
    setSelectedInvestment(investment);
    setOpenDialog(true);
  };

  const handleCancel = (investment: Investment) => {
    console.log("Cancel clicked for:", investment.id);
  };

  const handleEdit = (investment: Investment) => {
    console.log("Edit clicked for:", investment.id);
  };

  const handleViewDetails = (investment: Investment) => {
    console.log("View full details for:", investment.id);
    setSelectedInvestment(investment);
    setOpen(true);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {investments.map((investment) => {
          const status = investment.status ?? "pending";
          const config = statusConfig[status] ?? statusConfig.pending;

          return (
            <Card
              key={investment.id}
              className={cn(
                "group relative cursor-pointer border rounded-2xl shadow-sm transition hover:shadow-lg",
                currentInvestmentPlan?.id === investment.id
                  ? "ring-2 ring-blue-500 shadow-md"
                  : ""
              )}
              onClick={() => setCurrentInvestmentPlan(investment)}
            >
              {/* Top-right actions menu */}
              <div className="absolute top-3 right-3 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full shadow-md 
        bg-gradient-to-tr from-teal-100 via-emerald-50 to-teal-200 
        dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] 
        text-emerald-800 dark:text-emerald-200 
        hover:from-teal-200 hover:via-emerald-100 hover:to-teal-300 
        dark:hover:from-[#155c4a] dark:hover:via-[#0f3d33] dark:hover:to-[#0c2e28] 
        transition-all duration-300"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-xl border border-emerald-100/60 dark:border-emerald-900/40 
      shadow-xl backdrop-blur-sm
      bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 
      dark:from-[#081a16] dark:via-[#0b2a22] dark:to-[#09342c] 
      text-gray-800 dark:text-emerald-100 transition-all duration-300"
                  >
                    {status === "pending" && (
                      <>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(investment);
                          }}
                          className="flex items-center gap-2 rounded-md 
            hover:bg-gradient-to-r hover:from-teal-100 hover:via-emerald-50 hover:to-teal-200 
            dark:hover:from-[#1b5245] dark:hover:via-[#104439] dark:hover:to-[#0b352d]
            transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(investment);
                          }}
                          className="flex items-center gap-2 text-red-600 dark:text-red-400 rounded-md 
            hover:bg-gradient-to-r hover:from-red-100 hover:via-rose-50 hover:to-rose-200 
            dark:hover:from-[#4d1212] dark:hover:via-[#5c1a1a] dark:hover:to-[#701c1c]
            transition-all duration-200"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestReview(investment);
                          }}
                          className="flex items-center gap-2 rounded-md 
            hover:bg-gradient-to-r hover:from-teal-100 hover:via-emerald-50 hover:to-teal-200 
            dark:hover:from-[#1b5245] dark:hover:via-[#104439] dark:hover:to-[#0b352d]
            transition-all duration-200"
                        >
                          <MessageSquare className="w-4 h-4" /> Request Review
                        </DropdownMenuItem>
                      </>
                    )}

                    {status === "active" && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(investment);
                        }}
                        className="flex items-center gap-2 rounded-md 
          hover:bg-gradient-to-r hover:from-teal-100 hover:via-emerald-50 hover:to-teal-200 
          dark:hover:from-[#1b5245] dark:hover:via-[#104439] dark:hover:to-[#0b352d]
          transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" /> View Full Details
                      </DropdownMenuItem>
                    )}

                    {status !== "pending" && status !== "active" && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestReview(investment);
                        }}
                        className="flex items-center gap-2 rounded-md 
          hover:bg-gradient-to-r hover:from-teal-100 hover:via-emerald-50 hover:to-teal-200 
          dark:hover:from-[#1b5245] dark:hover:via-[#104439] dark:hover:to-[#0b352d]
          transition-all duration-200"
                      >
                        <MessageSquare className="w-4 h-4" /> Request Review
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="flex flex-row items-center gap-3 pr-10">
                <Avatar className="h-12 w-12 border shadow-sm">
                  <AvatarImage src="/placeholder-plan.png" alt="Plan Avatar" />
                  <AvatarFallback>
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {investment.plan?.title ?? `Plan ${investment.planId}`}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {investment.plan?.description ?? "No description available"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Deposit Amount
                    </span>
                    <span className="font-medium">
                      {investment.depositAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mining Cycle</span>
                    <span className="font-medium">
                      {investment.miningCycle} Month
                      {investment.miningCycle > 0 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Option</span>
                    <span className="font-medium capitalize">
                      {investment.option?.type ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={cn(
                        config.colorClass,
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                      )}
                    >
                      {config.icon} {config.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 🪟 Detail Dialog */}
      {selectedInvestment ? (
        <InvestmentDetailDialog
          open={open}
          onOpenChange={setOpen}
          investment={selectedInvestment}
        />
      ) : null}
      <RequestReviewDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        investment={selectedInvestment}
        userEmail={currentInvestmentPlan?.email}
      />
    </>
  );
};

export default AllPlans;
