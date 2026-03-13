"use client";

import { useCallback, useEffect, useState } from "react";

import { adminClient } from "@/services/client/admin-client";
import type { SiteContent } from "@/types/site-content";

export const useAdminSiteContent = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setContent(await adminClient.getSiteContent());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el contenido.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateContent = async (payload: SiteContent) => {
    const updated = await adminClient.updateSiteContent(payload);
    setContent(updated);
    return updated;
  };

  return {
    content,
    loading,
    error,
    reload: load,
    updateContent,
  };
};
