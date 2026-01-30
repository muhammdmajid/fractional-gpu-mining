import { FC } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";
import { MoreVertical, MessageSquare, XCircle, Eye } from "lucide-react";
import { SelectTransactionPublic } from "@/types/transaction";
import { AccountInfo } from "@/types/user-wallet-account";
import StatusBadgeTransaction from "./status-badge-transaction";


interface TransactionCardProps {
  tx: SelectTransactionPublic;
  currentAccount?: AccountInfo;
}

const TransactionCard: FC<TransactionCardProps> = ({ tx, currentAccount }) => {
  const onRequestReview = (txId: string) => {
    console.log("Request review for:", txId);
  };

  const onCancelRequest = (txId: string) => {
    console.log("Cancel request clicked for:", txId);
  };

  const onViewDetails = (txId: string) => {
    console.log("View full details clicked for:", txId);
  };

  return (
    <div key={tx.id} className="relative p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Three-dot dropdown pinned top-right */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {tx.status !== "completed" && (
              <DropdownMenuItem
                onClick={() => onRequestReview(tx.id)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Request Review
              </DropdownMenuItem>
            )}
            {tx.status === "pending" && (
              <DropdownMenuItem
                onClick={() => onCancelRequest(tx.id)}
                className="flex items-center gap-2 text-red-600"
              >
                <XCircle className="h-4 w-4" />
                Cancel Request
              </DropdownMenuItem>
            )}
            {tx.status === "completed" && (
              <DropdownMenuItem
                onClick={() => onViewDetails(tx.id)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Full Details
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-1 pr-10">
          <CardTitle
            className="text-sm sm:text-base md:text-lg lg:text-xl 
                       font-semibold text-gray-900 dark:text-gray-100 capitalize"
          >
            {tx.title || "Deposit"}
          </CardTitle>

          {tx.description && (
            <CardDescription
              className="text-xs sm:text-sm md:text-base 
                         text-gray-600 dark:text-gray-400"
            >
              {tx.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          {/* Date */}
          <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
            {new Date(tx.date).toLocaleString()}
          </div>

          {/* Amount */}
          <div className="text-sm sm:text-base md:text-lg font-semibold text-green-600 dark:text-green-400">
            +{Number(tx.amount).toFixed(2)} {currentAccount?.currency??"USDT"}
          </div>

          {/* Status */}
          <div className="sm:w-fit w-full">
            {tx.status && <StatusBadgeTransaction status={tx.status} />}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default TransactionCard;
