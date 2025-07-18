import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Fetching Latest Stories</h3>
            <p className="text-sm text-gray-500">This may take a few moments...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
