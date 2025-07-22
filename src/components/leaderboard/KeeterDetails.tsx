import React, { useState } from "react";
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

const keeperData = [
  {
    keeper_name: "mnemonic18",
    keeper_address: "0x4fdea08bc99e87ab3e68b3aaae2433b9da4cf7c3",
    consensus_address: "0x4fdea08bc99e87ab3e68b3aaae2433b9da4cf7c3",
    operator_id: "567890",
    version: "0.01",
    peer_id: "12D3KooWMFGp5PsoX9qmCf1QtzLXjpekkDgUjCFELaL2ysfNFB3D",
    is_active: true,
    last_checked_in: "0001-01-01T00:00:00Z",
  },

  // ... rest of your data
];

const KeeterDetails = ({
  activeTab,
  searchTerm,
}: {
  activeTab: string;
  searchTerm: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on active tab and search term
  const filteredData = keeperData.filter((item) => {
    // Filter by active tab
    const tabFilter =
      activeTab === "All" ||
      (activeTab === "Active" ? item.is_active : !item.is_active);

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
      {/* Results Info */}

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
          {currentPageData.length > 0 ? (
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

      {/* Only show pagination if there are items */}
      {totalItems > 0 && (
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
