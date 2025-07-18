import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface FilterBarProps {
  activeFilter: 'all' | 'privacy' | 'financial' | 'healthcare' | 'general';
  onFilterChange: (filter: 'all' | 'privacy' | 'financial' | 'healthcare' | 'general') => void;
  counts: {
    total: number;
    privacy: number;
    financial: number;
    healthcare: number;
    general: number;
  };
}

export default function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  const filters = [
    { key: 'all' as const, label: 'All AI Topics', count: counts.total, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { key: 'privacy' as const, label: 'General AI', count: counts.privacy, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
    { key: 'financial' as const, label: 'AI in Financial Services', count: counts.financial, color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' },
    { key: 'healthcare' as const, label: 'AI in Healthcare', count: counts.healthcare, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by topic:</span>
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant="secondary"
                size="sm"
                onClick={() => onFilterChange(filter.key)}
                className={`rounded-full text-xs font-medium border ${
                  activeFilter === filter.key
                    ? `${filter.color} border-2 shadow-sm`
                    : filter.color
                }`}
              >
                {filter.label}
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeFilter === filter.key
                    ? "bg-white bg-opacity-30"
                    : "bg-white bg-opacity-50"
                }`}>
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Stories from the last 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
