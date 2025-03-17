"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { AlertCircle } from "lucide-react";

interface ICompletedExamination {
  selectedClient: any;
}

export const CompletedExamination: React.FC<ICompletedExamination> = ({
  selectedClient,
}) => {
  if (!selectedClient) {
    return (
      <div className="p-4 border rounded-lg shadow-md bg-white text-gray-500">
        No examination data available.
      </div>
    );
  }

  if (selectedClient?.state === "Pending") {
    return (
      <div className="flex items-center gap-3 p-4 border rounded-lg shadow-md bg-yellow-50 text-yellow-700">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <span className="font-medium">Client not yet Examined!</span>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">
              Examination Details
            </CardTitle>
            <CardDescription>
              Examined by {selectedClient.examined_by} on{" "}
              <span className="font-medium">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(selectedClient.created_at))}
              </span>
            </CardDescription>
          </div>
          <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> {selectedClient.state}
          </span>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse border border-gray-300 text-sm md:text-base">
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-semibold w-1/3">Client Name:</td>
              <td className="p-3">{selectedClient.client_name}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">Registration No:</td>
              <td className="p-3">{selectedClient.client_reg_no}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">Examined By:</td>
              <td className="p-3">
                {selectedClient.examined_by || "Unassigned"}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">Examination Date:</td>
              <td className="p-3">{selectedClient.examination_date}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">Clinical History:</td>
              <td className="p-3">{selectedClient.clinical_history}</td>
            </tr>

            {/* Lens Details Header */}
            <tr className="border-b bg-gray-200 text-gray-800">
              <td colSpan={2} className="p-3 font-bold text-center">
                Lens Details
              </td>
            </tr>

            {/* Right Eye */}
            <tr className="border-b bg-gray-50">
              <td className="p-3 font-semibold">Right Sph:</td>
              <td className="p-3">{selectedClient.right_sph}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-3 font-semibold">Right Cyl:</td>
              <td className="p-3">{selectedClient.right_cyl}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-3 font-semibold">Right Axis:</td>
              <td className="p-3">{selectedClient.right_axis}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-3 font-semibold">Right VA:</td>
              <td className="p-3">{selectedClient.right_va}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-3 font-semibold">Right Add:</td>
              <td className="p-3">{selectedClient.right_add}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="p-3 font-semibold">Right IPD:</td>
              <td className="p-3">{selectedClient.right_ipd}</td>
            </tr>

            {/* Left Eye */}
            <tr className="border-b bg-gray-100">
              <td className="p-3 font-semibold">Left Sph:</td>
              <td className="p-3">{selectedClient.left_sph}</td>
            </tr>
            <tr className="border-b bg-gray-100">
              <td className="p-3 font-semibold">Left Cyl:</td>
              <td className="p-3">{selectedClient.left_cyl}</td>
            </tr>
            <tr className="border-b bg-gray-100">
              <td className="p-3 font-semibold">Left Axis:</td>
              <td className="p-3">{selectedClient.left_axis}</td>
            </tr>
            <tr className="border-b bg-gray-100">
              <td className="p-3 font-semibold">Left VA:</td>
              <td className="p-3">{selectedClient.left_va}</td>
            </tr>
            <tr className="border-b bg-gray-100">
              <td className="p-3 font-semibold">Left Add:</td>
              <td className="p-3">{selectedClient.left_add}</td>
            </tr>
            <tr className="border-b bg-gray-100">
              <td className="p-3 font-semibold">Left IPD:</td>
              <td className="p-3">{selectedClient.left_ipd}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
