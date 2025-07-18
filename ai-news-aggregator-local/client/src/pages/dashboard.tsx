import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StoryCard from "@/components/StoryCard";
import FilterBar from "@/components/FilterBar";
import LoadingOverlay from "@/components/LoadingOverlay";
import ApiUsageCard from "@/components/ApiUsageCard";
import { RefreshCw, Bot, Clock, Shield } from "lucide-react";

interface Story {
  id: number;
  title: string;
  description: string;
  url: string;
  sourceUrl: string;
  sourceName: string;
  sourceLogo?: string;
  additionalSources?: string;
  category: string;
  summary: string;
  publishedAt: string;
  isVerified: boolean;
  characterCount: number;
}

interface StoriesResponse {
  stories: Story[];
  counts: {
    total: number;
    privacy: number;
    financial: number;
    healthcare: number;
    general: number;
  };
}

type CategoryFilter = 'all' | 'privacy' | 'financial' | 'healthcare' | 'general';

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  const { data: storiesData, isLoading, error } = useQuery<StoriesResponse>({
    queryKey: ['/api/stories', activeFilter === 'all' ? undefined : activeFilter],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stories/refresh');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      setLastUpdated(new Date().toLocaleString());
      toast({
        title: "Stories Refreshed",
        description: `Found ${data.count} new stories`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh stories",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (storiesData?.stories?.length > 0) {
      setLastUpdated(new Date().toLocaleString());
    }
  }, [storiesData]);

  useEffect(() => {
    // Auto-refresh stories on initial load if none exist
    if (storiesData?.stories?.length === 0 && !isLoading) {
      refreshMutation.mutate();
    }
  }, [storiesData?.stories?.length, isLoading]);

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const filteredStories = storiesData?.stories || [];
  const counts = storiesData?.counts || { total: 0, privacy: 0, financial: 0, healthcare: 0, general: 0 };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Stories</h1>
          <p className="text-gray-600 mb-4">There was an error loading the AI news stories.</p>
          <Button onClick={handleRefresh} disabled={refreshMutation.isPending}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">V</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">AI Trending Stories</h1>
              </div>
              {lastUpdated && (
                <div className="hidden md:flex items-center space-x-2 ml-8">
                  <span className="text-sm text-gray-500">Last updated:</span>
                  <span className="text-sm font-medium text-gray-700">{lastUpdated}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh Stories
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={refreshMutation.isPending} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Usage Card */}
        <div className="mb-8">
          <ApiUsageCard />
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-24 bg-gray-100 rounded-lg mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="flex space-x-2">
                      <div className="h-9 bg-gray-200 rounded w-32"></div>
                      <div className="h-9 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Stories Found</h3>
            <p className="text-gray-600 mb-6">
              {activeFilter === 'all' 
                ? "No AI stories are currently available. Try refreshing to fetch the latest news."
                : `No stories found in the ${activeFilter} category. Try selecting a different filter.`
              }
            </p>
            <Button onClick={handleRefresh} disabled={refreshMutation.isPending}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Stories
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-8">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-500">
                Powered by News API, Claude AI, and Social Pilot
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Shield className="mr-1 h-4 w-4 text-green-500" />
                  Verified Sources Only
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-primary" />
                  Updated Every Hour
                </span>
              </div>
            </div>
            {lastUpdated && (
              <div className="text-sm text-gray-400">
                Last API check: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
