import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { ExternalLink, Copy, Check, TrendingUp, AlertTriangle, CheckCircle, RotateCcw, Share2, Smile } from "lucide-react";


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
  isDuplicate?: boolean;
  firstSeenAt?: string;
  echoCount?: number;
  socialMentions?: string;
}

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const { toast } = useToast();



  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(story.summary);
      setCopiedText(true);
      toast({
        title: "Copied to Clipboard",
        description: "The summary has been copied to your clipboard",
      });
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(story.url);
      setCopiedUrl(true);
      toast({
        title: "Article URL Copied",
        description: "The article link has been copied to your clipboard",
      });
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(story.title);
      setCopiedTitle(true);
      toast({
        title: "Title Copied",
        description: "The article title has been copied to your clipboard",
      });
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy title to clipboard",
        variant: "destructive",
      });
    }
  };



  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'privacy':
        return 'bg-blue-50 text-blue-700 border-l-4 border-blue-400';
      case 'financial':
        return 'bg-red-50 text-red-700 border-l-4 border-red-400';
      case 'healthcare':
        return 'bg-orange-50 text-orange-700 border-l-4 border-orange-400';
      default:
        return 'bg-blue-50 text-blue-700 border-l-4 border-blue-400'; // General AI in blue
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'financial':
        return 'AI in Financial Services';
      case 'healthcare':
        return 'AI in Healthcare';
      case 'privacy':
        return 'AI Privacy';
      default:
        return 'General AI';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getCardBorderColor = (category: string) => {
    switch (category) {
      case 'financial':
        return 'border-l-4 border-red-400';
      case 'healthcare':
        return 'border-l-4 border-orange-400';
      case 'privacy':
        return 'border-l-4 border-blue-400';
      default:
        return 'border-l-4 border-blue-400'; // General AI in blue
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${getCardBorderColor(story.category)}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {story.sourceName.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{story.sourceName}</span>
            </div>
            {story.isVerified && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-500">Verified Source</span>
              </div>
            )}
            {story.isDuplicate && story.firstSeenAt && (
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-amber-600">
                  Seen {timeAgo(story.firstSeenAt)}
                </span>
              </div>
            )}
            <Badge className={getCategoryColor(story.category)}>
              {getCategoryLabel(story.category)}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">{timeAgo(story.publishedAt)}</div>
        </div>

        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900 leading-tight flex-1 mr-2">
            {story.title}
          </h2>
          <Button
            onClick={handleCopyTitle}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 flex-shrink-0"
          >
            {copiedTitle ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>

        {/* Social Media Echo Count */}
        {story.echoCount && story.echoCount > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  {story.echoCount} social mentions
                </span>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            {story.socialMentions && (() => {
              try {
                const mentions = JSON.parse(story.socialMentions);
                return (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentions.map((mention: {platform: string, count: number}, index: number) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-white border border-purple-200 rounded-full text-xs text-purple-700"
                      >
                        <span className="font-medium">{mention.platform}:</span>
                        <span className="ml-1">{mention.count}</span>
                      </div>
                    ))}
                  </div>
                );
              } catch {
                return null;
              }
            })()}
          </div>
        )}

        {/* Additional Sources */}
        {story.additionalSources && (() => {
          try {
            const sources = JSON.parse(story.additionalSources);
            if (sources && sources.length > 0) {
              return (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="text-xs font-medium text-blue-800 mb-2">
                    Also reported by {sources.length} other source{sources.length > 1 ? 's' : ''}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source: {name: string, url: string}, index: number) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-white border border-blue-200 rounded text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <span>{source.name}</span>
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
          } catch (e) {
            // Invalid JSON, ignore
          }
          return null;
        })()}

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                AI-Generated Summary:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {story.summary}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Perfect for social media
                  </span>
                  <span>
                    {story.characterCount} characters
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySummary}
                  className="text-xs text-primary hover:text-blue-700"
                >
                  {copiedText ? (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Copy Text
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:text-blue-700 font-medium"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Read Original Article
            </a>
            <Button
              onClick={handleCopyUrl}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              {copiedUrl ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
