"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, Users, Eye, Plus, DollarSign, MapPin } from "lucide-react";
import {
  getTotalClients,
  getTotalExaminations,
  getTotalSales,
  getStaffMembers,
  createStaffMember,
  getBranches,
} from "@/lib/admin-api";
import { createBranch, createStaff, getStaff } from "@/actions";
import { useFetch } from "@/hooks";

export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "staff" | "receptionist" | "optometrist";
  is_active: boolean;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
}




export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState("month");
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [totalExaminations, setTotalExaminations] = useState<number | null>(null);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "" as "staff" | "receptionist" | "optometrist",
    password: "",
    re_password: ""
  });
  const [newBranch, setNewBranch] = useState({ name: "", code: "" });
  
  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
  } = useFetch(getStaff);

  useEffect(() => {
    if (staffData) {
      setStaffMembers(staffData);
    }
  }, [staffData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clients, exams, sales, branchData] = await Promise.all([
          getTotalClients(),
          getTotalExaminations(),
          getTotalSales(),
          getBranches(),
        ]);
        setTotalClients(clients);
        setTotalExaminations(exams);
        setTotalSales(sales);
        setBranches(branchData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(newStaff);
      const createdStaff = await createStaff(newStaff);
      setStaffMembers([...staffMembers, createdStaff]);
      setNewStaff({
        first_name: "",
        last_name: "",
        email: "",
        role: "" as "staff" | "receptionist" | "optometrist",
        password: "",
        re_password: ''
      });
    } catch (err) {
      setError("Failed to create staff member");
      console.error(err);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdBranch = await createBranch(newBranch);
      setBranches([...branches, createdBranch]);
      setNewBranch({ name: "", code: "" });
    } catch (err) {
      setError("Failed to create branch");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage your optical business with ease
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <Download className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
            Export Data
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 bg-red-100 dark:bg-red-900 p-2 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-blue-50 dark:bg-blue-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-200">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500 dark:text-blue-300" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">
              {loading ? "..." : totalClients ?? 0}
            </div>
            <span
              className="h-2 w-2 bg-green-500 rounded-full animate-pulse"
              title="Live Data"
            />
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Registered clients
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-200">
              Total Examinations
            </CardTitle>
            <Eye className="h-4 w-4 text-green-500 dark:text-green-300" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-800 dark:text-green-100">
              {loading ? "..." : totalExaminations ?? 0}
            </div>
            <span
              className="h-2 w-2 bg-green-500 rounded-full animate-pulse"
              title="Live Data"
            />
            <p className="text-xs text-green-600 dark:text-green-300">
              Completed exams
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-200">
              Staff Members
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500 dark:text-purple-300" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-100">
              {loading ? "..." : staffMembers.length}
            </div>
            <span
              className="h-2 w-2 bg-green-500 rounded-full animate-pulse"
              title="Live Data"
            />
            <p className="text-xs text-purple-600 dark:text-purple-300">
              Active employees
            </p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-200">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500 dark:text-orange-300" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-100">
              {loading ? "..." : totalSales ?? 0}
            </div>
            <span
              className="h-2 w-2 bg-green-500 rounded-full animate-pulse"
              title="Live Data"
            />
            <p className="text-xs text-orange-600 dark:text-orange-300">
              Completed orders
            </p>
          </CardContent>
        </Card>
        <Card className="bg-teal-50 dark:bg-teal-900 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-200">
              Total Branches
            </CardTitle>
            <MapPin className="h-4 w-4 text-teal-500 dark:text-teal-300" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold text-teal-800 dark:text-teal-100">
              {loading ? "..." : branches.length}
            </div>
            <span
              className="h-2 w-2 bg-green-500 rounded-full animate-pulse"
              title="Live Data"
            />
            <p className="text-xs text-teal-600 dark:text-teal-300">
              Active branches
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <TabsTrigger
            value="staff"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
          >
            Staff Management
          </TabsTrigger>
          <TabsTrigger
            value="branches"
            className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
          >
            Branch Management
          </TabsTrigger>
          {/* <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            Analytics
          </TabsTrigger> */}
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Staff Members
                </CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-blue-50 dark:bg-blue-900 px-5 py-3 text-sm font-medium text-blue-700 dark:text-blue-200">
                  <div className="text-left">Name</div>
                  <div className="text-left">Email</div>
                  <div className="text-left">Role</div>
                  <div className="text-left">Status</div>
                </div>

                {/* Loading or No Data State */}
                {loading ? (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                    Loading...
                  </div>
                ) : staffMembers.length === 0 ? (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                    No staff members found
                  </div>
                ) : (
                  // Staff Member Rows
                  staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="grid grid-cols-4 items-center gap-y-2 border-b border-gray-200 dark:border-gray-700 px-5 py-4 text-sm last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
                        {`${staff.first_name} ${staff.last_name}`}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {staff.email}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 capitalize">
                        {staff.role}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            staff.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {staff.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Staff Member
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateStaff} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={newStaff.first_name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, first_name: e.target.value })
                      }
                      placeholder="John"
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={newStaff.last_name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, last_name: e.target.value })
                      }
                      placeholder="Smith"
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                      placeholder="john.smith@example.com"
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Role
                    </Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(value) =>
                        setNewStaff({
                          ...newStaff,
                          role: value as
                            | "staff"
                            | "receptionist"
                            | "optometrist",
                        })
                      }
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="receptionist">
                          Receptionist
                        </SelectItem>
                        <SelectItem value="optometrist">Optometrist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStaff.password}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, password: e.target.value })
                      }
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="re_password"
                      type="password"
                      value={newStaff.re_password}
                      onChange={(e) =>
                        setNewStaff({
                          ...newStaff,
                          re_password: e.target.value,
                        })
                      }
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Staff
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Branches
                </CardTitle>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="grid grid-cols-3 bg-teal-50 dark:bg-teal-900 p-3 text-sm font-medium text-teal-700 dark:text-teal-200">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Code</div>
                </div>
                {loading ? (
                  <div className="p-3 text-center text-gray-600 dark:text-gray-400">
                    Loading...
                  </div>
                ) : branches.length === 0 ? (
                  <div className="p-3 text-center text-gray-600 dark:text-gray-400">
                    No branches found
                  </div>
                ) : (
                  branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 p-3 text-sm last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {branch.id}
                      </div>
                      <div className="text-gray-800 dark:text-gray-200">
                        {branch.name}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {branch.code}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Branch
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateBranch} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="branchName"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Branch Name
                    </Label>
                    <Input
                      id="branchName"
                      value={newBranch.name}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, name: e.target.value })
                      }
                      placeholder="Main Branch"
                      className="border-gray-300 dark:border-gray-600 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="branchCode"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Branch Code
                    </Label>
                    <Input
                      id="branchCode"
                      value={newBranch.code}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, code: e.target.value })
                      }
                      placeholder="MB001"
                      maxLength={5}
                      className="border-gray-300 dark:border-gray-600 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Create Branch
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Business Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-16 w-16 text-purple-500 dark:text-purple-300" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Analytics placeholder (e.g., charts for clients, exams,
                  sales).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Business Name
                  </Label>
                  <Input
                    placeholder="Optical Store"
                    className="border-gray-300 dark:border-gray-600 focus:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Contact Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    className="border-gray-300 dark:border-gray-600 focus:ring-gray-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}