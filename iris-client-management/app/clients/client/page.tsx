"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Edit, FileText, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Client, Examination, fetchClientById } from "@/lib/clients";

export default function ClientPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [client, setClient] = useState<(Client & { examinations: Examination[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "No client ID provided",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`Fetching client with ID: ${id}`);
        const data = await fetchClientById(id);
        console.log("Client data received:", data);
        setClient(data);
        if (!data) {
          toast({
            title: "Warning",
            description: "No client data returned",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load client",
          variant: "destructive",
        });
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadClient();
  }, [id, toast]);

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading client...</div>;
  }

  if (!client) {
    return <div className="text-center text-muted-foreground">Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{`${client.first_name} ${client.last_name}`}</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Registration Number</dt>
                <dd className="text-sm">{client.reg_no}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                <dd className="text-sm">{client.dob || "N/A"}</dd> {/* Fixed dob to date_of_birth */}
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{client.phone_number || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{client.email || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Visit</dt>
                <dd className="text-sm">
                  {client.last_examination_date
                    ? new Date(client.last_examination_date).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="examinations">
            <TabsList className="w-full">
              <TabsTrigger value="examinations" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Examination History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="examinations" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Examination History</CardTitle>
                  <CardDescription>View all examinations for this client</CardDescription>
                </CardHeader>
                <CardContent>
                  {client.examinations.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No examination history found.</div>
                  ) : (
                    <ul className="space-y-4">
                      {client.examinations.map((exam) => (
                        <li key={exam.id} className="text-sm border-b pb-2">
                          <div>
                            <span className="font-medium">
                              {new Date(exam.examination_date).toLocaleDateString()}
                            </span>
                            : {exam.state} {exam.booked_for_sales ? "(Booked for Sales)" : ""}
                          </div>
                          <div>Examined by: {exam.examined_by || "N/A"}</div>
                          <div>Clinical History: {exam.clinical_history || "N/A"}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <strong>Right Eye:</strong><br />
                              SPH: {exam.right_sph ?? "N/A"}<br />
                              CYL: {exam.right_cyl ?? "N/A"}<br />
                              Axis: {exam.right_axis ?? "N/A"}<br />
                              Add: {exam.right_add ?? "N/A"}<br />
                              VA: {exam.right_va || "N/A"}<br />
                              IPD: {exam.right_ipd ?? "N/A"}
                            </div>
                            <div>
                              <strong>Left Eye:</strong><br />
                              SPH: {exam.left_sph ?? "N/A"}<br />
                              CYL: {exam.left_cyl ?? "N/A"}<br />
                              Axis: {exam.left_axis ?? "N/A"}<br />
                              Add: {exam.left_add ?? "N/A"}<br />
                              VA: {exam.left_va || "N/A"}<br />
                              IPD: {exam.left_ipd ?? "N/A"}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}