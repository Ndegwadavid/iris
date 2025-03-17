"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  SearchClient,
  ExaminationForm,
  CompletedExamination,
} from "@/components";

export default function ExaminationPage() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Eye Examination
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel (SearchClient) */}
        <div className="w-full md:w-1/3">
          <SearchClient
            setSelectedClient={setSelectedClient}
          />
        </div>

        {/* Right Panel with Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs
            defaultValue="pending"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="px-4">
              <TabsList className="w-full">
                <TabsTrigger value="pending" className="flex-1">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="pt-2">
              <ExaminationForm selectedClient={selectedClient} />
            </TabsContent>

            <TabsContent value="completed" className="pt-2">
              <CompletedExamination selectedClient={selectedClient} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
