import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import { Typography } from "../ui/Typography";
import { LucideCopyButton } from "../ui/CopyButton";
import { TablePagination } from "../ui/TablePagination";
import TableSkeleton from "../ui/TableSkeleton";
import KeeperMobileCard from "./KeeperMobileCard";

// Helper for address truncation
function truncateAddress(address: string) {
  return address.length > 10
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

const columns = [
  { key: "keeper_name", label: "Name", sortable: false },
  { key: "keeper_address", label: "Address", sortable: false },
  { key: "consensus_address", label: "Consensus Address", sortable: false },
  { key: "operator_id", label: "Operator ID", sortable: false },
  { key: "version", label: "Version", sortable: false },
  { key: "peer_id", label: "Peer ID", sortable: false },
  { key: "last_checked_in", label: "Last Checked In", sortable: false },
];

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

interface ApiResponse {
  active_keepers: number;
  keepers: KeeperData[];
  timestamp: string;
  total_keepers: number;
}

const KeeterDetails = ({
  activeTab,
  searchTerm,
}: {
  activeTab: string;
  searchTerm: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [keeperData, setKeeperData] = useState<KeeperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch keeper data from API
  useEffect(() => {
    const fetchKeeperData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching keeper data...");
        // Try multiple CORS proxy options
        const proxyUrls = [
          "https://api.allorigins.win/get?url=https://health.triggerx.network/operators",
          "https://corsproxy.io/?https://health.triggerx.network/operators",
          "https://cors-anywhere.herokuapp.com/https://health.triggerx.network/operators",
        ];

        let response;
        let lastError;

        for (const proxyUrl of proxyUrls) {
          try {
            console.log(`Trying proxy: ${proxyUrl}`);
            response = await fetch(proxyUrl);
            if (response.ok) {
              break;
            }
          } catch (err) {
            console.log(`Proxy failed: ${proxyUrl}`, err);
            lastError = err;
            continue;
          }
        }
        console.log(response);
        if (!response || !response.ok) {
          throw (
            lastError || new Error(`HTTP error! status: ${response?.status}`)
          );
        }

        const responseData = await response.json();
        console.log(responseData);

        // Handle different proxy response formats
        let data: ApiResponse;
        if (responseData.contents) {
          // allorigins.win format
          data = JSON.parse(responseData.contents);
        } else {
          // Direct format
          data = responseData;
        }

        console.log("Parsed data:", data);
        setKeeperData(data.keepers || []);
      } catch (err) {
        console.error("Error fetching keeper data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch keeper data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKeeperData();
  }, []);

  const filteredData = keeperData.filter((item) => {
    // Filter by active tab
    const tabFilter = activeTab === "Active" ? item.is_active : !item.is_active;

    // Filter by keeper address search
    const searchFilter =
      searchTerm === "" ||
      item.keeper_address.toLowerCase().includes(searchTerm.toLowerCase());

    return tabFilter && searchFilter;
  });

  // Calculate pagination values
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get current page data
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Reset to page 1 if current page exceeds total pages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-4">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              {columns.map((column) => (
                <TableHead key={column.key} className="h-14 px-6">
                  <Typography
                    variant="h4"
                    color="primary"
                    align="left"
                    className="text-nowrap"
                  >
                    {column.label}
                  </Typography>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton columns={columns} rows={10} />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-6 py-8 text-center"
                >
                  <Typography variant="body" color="error" align="center">
                    Error: {error}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : currentPageData.length > 0 ? (
              currentPageData.map((item, idx) => (
                <TableRow key={startIndex + idx} className="text-nowrap">
                  <TableCell
                    className={`border-l-4 px-6 py-4 ${
                      item.is_active ? "border-green-500" : "border-red-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Typography variant="body" color="primary" align="left">
                        {item.keeper_name}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Typography variant="body" color="gray" align="left">
                        {truncateAddress(item.keeper_address)}
                      </Typography>
                      <LucideCopyButton text={item.keeper_address} />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Typography variant="body" color="primary" align="left">
                      {truncateAddress(item.consensus_address || "-")}
                    </Typography>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Typography variant="body" color="primary" align="left">
                      {item.operator_id || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Typography
                      variant="body"
                      color="primary"
                      align="center"
                      className="bg-[#976fb93e] text-white rounded-full p-1.5 border-[#C07AF6] border"
                    >
                      {item.version || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Typography variant="body" color="primary" align="left">
                      {truncateAddress(item.peer_id)}
                    </Typography>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Typography variant="body" color="primary" align="left">
                      {item.last_checked_in}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-6 py-8 text-center"
                >
                  <Typography variant="body" color="gray" align="center">
                    {searchTerm
                      ? `No keepers found matching "${searchTerm}"`
                      : "No keepers found"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="block md:hidden">
        <KeeperMobileCard
          currentPageData={currentPageData}
          startIndex={startIndex}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
        />
      </div>

      {!loading && totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default KeeterDetails;
