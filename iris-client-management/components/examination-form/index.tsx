import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock } from "lucide-react";
import { registerExamination } from "@/actions";

interface ExaminationFormProps {
  selectedClient: any;
}

export const ExaminationForm: React.FC<ExaminationFormProps> = ({
  selectedClient,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient?.id) {
      alert("No client selected.");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    setLoading(true);
    try {
      const response = await registerExamination(form, selectedClient.id);
      console.log("Examination Registered:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const examFields = ["sph", "cyl", "axis", "add", "va", "ipd"];
  const isCompleted = selectedClient?.state === "Completed";

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>
              {selectedClient?.client_name
                ? `Prescription for ${selectedClient?.client_name} `
                : "Prescription"}
            </CardTitle>
            <CardDescription>
              {selectedClient?.registered_by ? (
                <>
                  Registered by {selectedClient.registered_by} on{" "}
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
                </>
              ) : null}
            </CardDescription>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${
              isCompleted
                ? "text-green-600 bg-green-100"
                : "text-amber-600 bg-amber-100"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-3 w-3" /> Completed
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" /> Pending
              </>
            )}
          </span>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["right", "left"].map((side, index) => (
              <div
                key={side}
                className={`space-y-4 ${
                  index === 0 ? "md:border-r md:pr-4" : ""
                }`}
              >
                <div className="text-center font-medium text-primary">
                  {side === "right" ? "Right Eye (R)" : "Left Eye (L)"}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {examFields.map((field) => (
                    <div key={field} className="grid gap-2">
                      <Label htmlFor={`${side}_${field}`}>
                        {field.toUpperCase()}
                      </Label>
                      <Input
                        id={`${side}_${field}`}
                        placeholder="-"
                        value={formData[`${side}_${field}`] || ""}
                        onChange={handleInputChange}
                        disabled={isCompleted}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="examined_by">Examined By</Label>
            <Input
              id="examined_by"
              placeholder="Enter examiner's name"
              value={formData["examined_by"] || ""}
              onChange={handleInputChange}
              disabled={isCompleted}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clinical_history">Clinical History</Label>
            <Textarea
              id="clinical_history"
              placeholder="Enter any relevant clinical history or notes"
              rows={4}
              value={formData["clinical_history"] || ""}
              onChange={handleInputChange}
              disabled={isCompleted}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between border-t bg-muted/20 px-6 py-4 gap-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading || isCompleted}>
            {loading ? (
              "Saving..."
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Save Record
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
