import React from "react";
import { Typography } from "../ui/Typography";
import { LucideCopyButton } from "../ui/CopyButton";

// Helper for address truncation
function truncateAddress(address: string) {
  return address.length > 10
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

interface KeeperData {
  keeper_name: string;
  keeper_address: string;
  consensus_address: string;
  operator_id: string;
  version: string;
  peer_id: string;
  is_active: boolean;
  last_checked_in: string;
}

interface KeeperMobileCardProps {
  currentPageData: KeeperData[];
  startIndex: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const KeeperMobileCard: React.FC<KeeperMobileCardProps> = ({
  currentPageData,
  startIndex,
  loading,
  error,
  searchTerm,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="bg-[#303030] rounded-lg p-4 animate-pulse">
            <div className="h-3 bg-[#303030] rounded mb-1"></div>
            <div className="h-3 bg-[#303030] rounded mb-1"></div>
            <div className="h-3 bg-[#303030] rounded"></div>
            <div className="h-4 bg-[#303030] rounded mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
        <Typography variant="body" color="error" align="center">
          Error: {error}
        </Typography>
      </div>
    );
  }

  if (currentPageData.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-8 text-center">
        <Typography variant="body" color="gray" align="center">
          {searchTerm
            ? `No keepers found matching "${searchTerm}"`
            : "No keepers found"}
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentPageData.map((item, idx) => (
        <div
          key={startIndex + idx}
          className={`bg-[#1A1A1A] border-l-4 rounded-lg p-4 space-y-3 ${
            item.is_active ? "border-green-500" : "border-red-500"
          }`}
        >
          {/* Keeper Name and Version */}
          <div className="flex items-center justify-between">
            <Typography variant="h2" color="primary" align="left">
              {item.keeper_name}
            </Typography>
            <div className="flex items-center space-x-2">
              <Typography variant="h4" color="gray" align="left">
                Version
              </Typography>
              <div className="inline-block">
                <Typography
                  variant="h4"
                  color="primary"
                  align="center"
                  className="bg-[#976fb93e] text-white rounded-full px-2 py-1 border-[#C07AF6] border "
                >
                  {item.version || "-"}
                </Typography>
              </div>
            </div>
          </div>

          {/* Keeper Address */}
          <div className="space-y-1">
            <Typography variant="h4" color="gray" align="left">
              Address
            </Typography>
            <div className="flex items-center">
              <Typography variant="h4" color="primary" align="left">
                {truncateAddress(item.keeper_address)}
              </Typography>
              <LucideCopyButton text={item.keeper_address} />
            </div>
          </div>

          {/* Consensus Address */}
          <div className="space-y-1">
            <Typography variant="h4" color="gray" align="left">
              Consensus Address
            </Typography>
            <Typography variant="h4" color="primary" align="left">
              {truncateAddress(item.consensus_address || "-")}
            </Typography>
          </div>

          {/* Operator ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Typography variant="h4" color="gray" align="left">
                Operator ID
              </Typography>
              <Typography variant="h4" color="primary" align="left">
                {item.operator_id || "-"}
              </Typography>
            </div>
          </div>

          {/* Peer ID */}
          <div className="space-y-1">
            <Typography variant="h4" color="gray" align="left">
              Peer ID
            </Typography>
            <Typography variant="h4" color="primary" align="left">
              {truncateAddress(item.peer_id)}
            </Typography>
          </div>

          {/* Last Checked In */}
          <div className="space-y-1">
            <Typography variant="h4" color="gray" align="left">
              Last Checked In
            </Typography>
            <Typography variant="h4" color="primary" align="left">
              {item.last_checked_in}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeeperMobileCard;
