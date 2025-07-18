import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertTriangle } from 'lucide-react';

interface ApiUsage {
  date: string;
  newsApiCalls: number;
  anthropicApiCalls: number;
  socialPilotCalls: number;
  newsApiLimit: number;
  anthropicApiLimit: number;
  socialPilotLimit: number;
}

export default function ApiUsageCard() {
  const { data: usage, isLoading, error } = useQuery<ApiUsage>({
    queryKey: ['/api/usage'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2 animate-pulse" />
            API Usage Today
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !usage) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            API Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-red-600">Unable to load usage data</p>
        </CardContent>
      </Card>
    );
  }

  const getUsagePercentage = (calls: number, limit: number) => {
    return Math.round((calls / limit) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const newsPercentage = getUsagePercentage(usage.newsApiCalls, usage.newsApiLimit);
  const anthropicPercentage = getUsagePercentage(usage.anthropicApiCalls, usage.anthropicApiLimit);
  const socialPilotPercentage = getUsagePercentage(usage.socialPilotCalls, usage.socialPilotLimit);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          API Usage Today
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* News API */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">News API</span>
              <span className={`text-xs ${getStatusColor(newsPercentage)}`}>
                {usage.newsApiCalls}/{usage.newsApiLimit}
              </span>
            </div>
            <Progress value={newsPercentage} className="h-1" />
          </div>

          {/* Anthropic API */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Anthropic API</span>
              <span className={`text-xs ${getStatusColor(anthropicPercentage)}`}>
                {usage.anthropicApiCalls}/{usage.anthropicApiLimit}
              </span>
            </div>
            <Progress value={anthropicPercentage} className="h-1" />
          </div>

          {/* Social Pilot API */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Social Pilot API</span>
              <span className={`text-xs ${getStatusColor(socialPilotPercentage)}`}>
                {usage.socialPilotCalls}/{usage.socialPilotLimit}
              </span>
            </div>
            <Progress value={socialPilotPercentage} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}