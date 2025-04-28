import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "@shared/schema";

type DateFilterProps = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export default function DateFilter({
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchQueryChange,
}: DateFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <label className="text-sm font-medium text-secondary block mb-1">Date Range</label>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={(value) => onDateRangeChange(value as DateRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="default">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Input
            type="text"
            placeholder="Search inventory..."
            className="pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-2.5 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button className="hidden sm:flex items-center">
          <Download className="mr-1 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
