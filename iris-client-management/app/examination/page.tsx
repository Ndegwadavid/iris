"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SearchClient, ExaminationForm } from "@/components";

export default function ExaminationPage() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Eye Examination
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel (SearchClient) */}
        <div className="w-full md:w-1/3">
          <SearchClient setSelectedClient={setSelectedClient} />
        </div>

        {/* Right Panel (ExaminationForm) */}
        <div className="w-full md:w-2/3">
          <ExaminationForm selectedClient={selectedClient} />
        </div>
      </div>

      <Toaster />
    </div>
  );
}
