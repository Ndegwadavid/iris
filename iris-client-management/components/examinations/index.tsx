import React, { useState, useEffect } from "react";
import { useFetch } from "@/hooks";
import { getExaminations } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, CheckCircle, Clock } from "lucide-react";

interface IExamination {
  client_reg_no?: string;
  setSelectedClient: (data: any) => void;
}

export const Examinations: React.FC<IExamination> = ({
  client_reg_no,
  setSelectedClient,
}) => {
  const [query, setQuery] = useState<string>(client_reg_no || "");
  const { data, loading, error } = useFetch(getExaminations);

  // pdate `query` whenever `client_reg_no` changes
  useEffect(() => {
    setQuery(client_reg_no || "");
  }, [client_reg_no]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  // Ensure `data.d` is an array to prevent runtime errors
  const exams = Array.isArray(data?.d) ? data.d : [];

  // Filter based on the query
  const filteredExams = query
    ? exams.filter((exam: any) => exam.client_reg_no === query)
    : exams;

  // Separate pending and completed exams
  const pendingExams = filteredExams.filter(
    (exam: any) => exam.state === "Pending"
  );
  const completedExams = filteredExams.filter(
    (exam: any) => exam.state === "Completed"
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Examinations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="pending">
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

            {/* Pending Examinations */}
            <TabsContent value="pending" className="pt-2">
              <div className="space-y-2 px-4 pb-4">
                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {pendingExams.length > 0 ? (
                  pendingExams.map((exam: any) => (
                    <Card key={exam.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{exam.client_name}</p>
                          <p className="text-sm text-gray-500">
                            {exam.client_reg_no}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClient(exam)}
                            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 focus:ring-2 focus:ring-primary/30"
                          >
                            <Clock className="h-4 w-4" />
                            Start
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No pending examinations</p>
                )}
              </div>
            </TabsContent>

            {/* Completed Examinations */}
            <TabsContent value="completed" className="pt-2">
              <div className="space-y-2 px-4 pb-4">
                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {completedExams.length > 0 ? (
                  completedExams.map((exam: any) => (
                    <Card key={exam.id} className="p-3 bg-green-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{exam.client_name}</p>
                          <p className="text-sm text-gray-500">{exam.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No completed examinations</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
