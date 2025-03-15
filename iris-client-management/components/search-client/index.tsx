import React, { useState } from "react";
import { useFetch } from "@/hooks";
import { searchClient } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Eye, CheckCircle } from "lucide-react";
import { Examinations } from "../examinations";

interface ISearchClient {
  setSelectedClient: (data: any) => void;
}

export const SearchClient: React.FC<ISearchClient> = ({ setSelectedClient }) => {
  const [query, setQuery] = useState<string>("");
  const [selectedRegNo, setSelectedRegNo] = useState<string | null>(null);
  const { data, loading, error } = useFetch(searchClient, query);

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Search</CardTitle>
              <CardDescription>Find a client to examine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {loading && <p className="text-gray-500 mt-2">Loading...</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}

              <ul className="mt-4 space-y-2">
                {data?.length > 0 ? (
                  data.map((client: any) => (
                    <Card key={client.reg_no} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            {client.first_name} {client.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {client.reg_no}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => {
                              setSelectedRegNo(client.reg_no);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 mt-2">No clients found</p>
                )}
              </ul>
            </CardContent>
          </Card>
          <Examinations
            setSelectedClient={setSelectedClient}
            client_reg_no={selectedRegNo || ""}
          />
        </div>
      </div>
    </div>
  );
};
