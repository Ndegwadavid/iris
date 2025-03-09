"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Business performance insights</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">
              Display charts and analytics here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}