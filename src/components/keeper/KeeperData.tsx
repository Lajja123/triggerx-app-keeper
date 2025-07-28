"use client";
import React, { Suspense, useState } from "react";
import { Typography } from "../ui/Typography";
import SearchBar from "../ui/SearchBar";
import KeeterDetails from "./KeeterDetails";

function KeeperData() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const tabs = ["All", "Active", "Inactive"];

  return (
    <Suspense>
      <div className="w-[90%] mx-auto">
        <Typography variant="h1" color="primary">
          Operators
        </Typography>
        <Typography variant="h4" color="secondary" className="my-6">
          See how operators rank based on jobs completed and rewards earned
          weekly.
        </Typography>
        <div className="flex flex-col xl:flex-row justify-end items-end gap-6 py-4">
          <div className="flex flex-col xl:flex-row   gap-6 justify-between items-center w-full lg:mb-8">
            <div className="flex w-full md:w-auto gap-4 bg-[#181818F0] rounded-lg p-2 justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? "border-[#F8FF7C] text-[#F8FF7C]"
                      : "border-transparent text-white "
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <SearchBar
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
              onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>
        <KeeterDetails activeTab={activeTab} searchTerm={searchTerm} />
      </div>
    </Suspense>
  );
}

export default KeeperData;
