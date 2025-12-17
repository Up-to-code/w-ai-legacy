"use client";

import { useTags } from "@/lib/hooks/use-tags";
import { X } from "lucide-react";

const TAG_COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  green: "bg-green-100 text-green-700 border-green-200",
  red: "bg-red-100 text-red-700 border-red-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  gray: "bg-gray-100 text-gray-700 border-gray-200",
};

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function TagSelector({ selectedTags, onChange, label, placeholder }: TagSelectorProps) {
  const { tags, loading } = useTags();

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));
  const availableTags = tags.filter((tag) => !selectedTags.includes(tag.id));

  const getColorClass = (color?: string) => {
    return TAG_COLOR_CLASSES[color || "blue"] || TAG_COLOR_CLASSES.blue;
  };

  if (loading) {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      {/* Selected Tags */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTagObjects.map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getColorClass(tag.color)}`}
            >
              {tag.name}
              <button
                onClick={() => handleToggleTag(tag.id)}
                className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleToggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105 ${getColorClass(tag.color)} opacity-60 hover:opacity-100`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      ) : selectedTagObjects.length === 0 ? (
        <p className="text-gray-400 text-sm">
          {placeholder || "لا توجد وسوم متاحة"}
        </p>
      ) : null}
    </div>
  );
}
