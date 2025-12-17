"use client";

import { useState, useEffect, useCallback } from "react";
import { getTags, createTag, updateTag, deleteTag, updateTagCounts } from "@/app/actions/tags";
import type { Tag, CreateTagData, UpdateTagData } from "@/types/tag";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tags
  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTags();
      if (result.success && result.data) {
        setTags(result.data);
      } else {
        setError(result.error || "حدث خطأ أثناء جلب الوسوم");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new tag
  const addTag = useCallback(async (data: CreateTagData) => {
    try {
      const result = await createTag(data);
      if (result.success && result.data) {
        setTags((prev) => [...prev, result.data as Tag]);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  // Update existing tag
  const editTag = useCallback(async (id: string, data: UpdateTagData) => {
    try {
      const result = await updateTag(id, data);
      if (result.success && result.data) {
        setTags((prev) =>
          prev.map((tag) => (tag.id === id ? (result.data as Tag) : tag))
        );
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  // Delete tag
  const removeTag = useCallback(async (id: string) => {
    try {
      const result = await deleteTag(id);
      if (result.success) {
        setTags((prev) => prev.filter((tag) => tag.id !== id));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  // Refresh tag counts
  const refreshTagCounts = useCallback(async () => {
    try {
      const result = await updateTagCounts();
      if (result.success) {
        // Refetch tags to get updated counts
        await fetchTags();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [fetchTags]);

  // Fetch tags on mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    fetchTags,
    addTag,
    editTag,
    removeTag,
    refreshTagCounts,
  };
}
