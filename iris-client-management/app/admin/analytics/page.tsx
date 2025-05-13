"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useFetch } from "@/hooks";
import { getAnalytics } from "@/actions";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPage() {
  const { data, loading, error } = useFetch(getAnalytics);

  if (loading)
    return <p className="text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const COLORS = ["#26c7ed", "#7a2afd", "#ff9800", "#f44336"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Business performance insights</p>
      </div>

      {/* Clients Per Branch */}
      <Card>
        <CardHeader>
          <CardTitle>Clients Per Branch</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.clients_per_branch || []}>
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#26c7ed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales Per Branch */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Per Branch</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.sales_per_branch || []}>
              <XAxis dataKey="examination__client__branch" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#7a2afd" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.sales_by_payment_method || []}>
              <XAxis dataKey="payment_method" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.gender_distribution || []}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label={({ name, value }) =>
                  `${name === "M" ? "Male" : "Female"}: ${value}`
                }
              >
                <Cell key="male" fill="#26c7ed" />
                <Cell key="female" fill="#f44336" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthly_sales || []}>
              <XAxis
                dataKey="month"
                tickFormatter={(tick) =>
                  new Date(tick).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#ff9800" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
