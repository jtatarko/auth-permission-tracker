import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FeatureRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { email: string; notes: string }) => void;
}

const FeatureRequestSheet: React.FC<FeatureRequestSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState("john@company.com");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ email, notes });
    }
    // Reset form
    setNotes("");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {/* Header with badge */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Track permission changes
            </h2>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Data Quality Feature Suite
          </Badge>
        </div>

        {/* Hero Image with Gradient Circles */}
        <div className="relative mb-8 bg-gray-100 rounded-lg h-64 flex items-center justify-center overflow-hidden">
          {/* Decorative gradient circles */}
          <div className="absolute top-4 left-1/4 w-32 h-32 bg-gradient-to-br from-teal-300 to-green-400 rounded-full opacity-60 blur-2xl"></div>
          <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-br from-teal-400 to-green-300 rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute bottom-4 left-8 w-36 h-36 bg-gradient-to-br from-green-300 to-teal-400 rounded-full opacity-60 blur-2xl"></div>
          <div className="absolute bottom-8 right-1/4 w-32 h-32 bg-gradient-to-br from-teal-300 to-green-300 rounded-full opacity-50 blur-2xl"></div>

          {/* Placeholder for feature screenshot */}
          <div className="relative z-10 backdrop-blur-md bg-white/30 rounded-lg p-8 border border-white/50">
            <div className="text-center space-y-2">
              <div className="w-48 h-32 bg-white/50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Feature Screenshot</span>
              </div>
              <p className="text-sm text-gray-600">
                Preview will be replaced with actual feature images
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              No access, no data
            </h3>
            <p className="text-sm text-gray-600">
              Know when your authorizations have some permissions (ad accounts,
              customers, etc.) removed or added.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Share the tracking
            </h3>
            <p className="text-sm text-gray-600">
              Filter time range, data sources, and share all changes in
              authorization permissions with the right teams to understand the
              cause.
            </p>
          </div>
        </div>

        {/* Request Form */}
        <div className="space-y-6 mb-8">
          <div>
            <p className="text-base text-gray-700 mb-6">
              Request feature and your Account Manager will be in touch soon to
              provide more details.
            </p>

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full"
                />
              </div>

              {/* Notes Textarea */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional"
                  className="w-full min-h-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <SheetFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Request feature
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FeatureRequestSheet;
