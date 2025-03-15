import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getBranches } from "@/actions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface IBranch {
  id: string;
  name: string;
  code: string;
}

export const SelectBranch = () => {
  const { data: branches = [], loading } = useFetch(getBranches);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState<string | null>(
    null
  );

  return (
    <div className="grid pt-4 gap-2">
      <Label htmlFor="branch" className="flex items-center">
        <span>Branch</span>
        <span className="text-sm text-muted-foreground ml-1">(required)</span>
      </Label>
      <Select
        value={selectedBranch || ""}
        onValueChange={(value) => {
          setSelectedBranch(value);
          const selected = branches.find((b: IBranch) => b.name === value);
          if (selected) {
            setSelectedBranchCode(selected.code);
          }
        }}
        name="branch"
        required
      >
        <SelectTrigger id="branch" className="w-full border-2">
          <SelectValue>
            {selectedBranch
              ? `${selectedBranch} (${selectedBranchCode})`
              : "Select a branch"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="text-sm text-muted-foreground p-2">
              Loading branches...
            </div>
          ) : branches.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2">
              No branches available
            </div>
          ) : (
            branches.map((branch: IBranch) => (
              <SelectItem key={branch.id} value={branch.name}>
                {branch.name} ({branch.code})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <div className="min-h-5 text-xs" aria-live="polite">
        {selectedBranch ? (
          <span className="text-muted-foreground">
            Selected branch: {selectedBranch} ({selectedBranchCode})
          </span>
        ) : (
          <span className="text-destructive">Please select a branch</span>
        )}
      </div>
    </div>
  );
};
