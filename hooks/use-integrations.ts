"use client";

import { useState, useEffect, useCallback } from "react";
import { getIntegrations } from "@/app/actions/integrations";
import type { Integration } from "@/types/integration";

export interface IntegrationStatus {
  serviceId: string;
  isConnected: boolean;
  status: "connected" | "disconnected" | "loading";
  lastSync?: Date;
  data?: Integration;
}

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback((integration: Integration): boolean => {
    // 1. Explicit Connected Status
    if (integration.status === 'connected') return true;
    
    // 2. Explicit Disconnected Status (usually overrides everything else, but user wants to see if it *can* work)
    // If we have credentials but status is disconnected, it might mean the user clicked "Disconnect"
    // but the DB wasn't fully cleaned, OR they re-connected partially.
    // However, the user specifically said "if i alrdy ingeit... shoe he si latd coan".
    // So we will prioritize CREDENTIALS existence.
    
    if (!integration.credentials) return false;

    try {
      const creds = typeof integration.credentials === 'string' 
        ? JSON.parse(integration.credentials) 
        : integration.credentials;

      // Status override: If explicit 'disconnected', we might still want to check if creds are valid.
      // But usually 'disconnected' means we shouldn't use it. 
      // User's issue seems to be that it *is* working but status is wrong.
      
      switch (integration.serviceId) {
        case 'whatsapp':
          // WhatsApp needs accessToken and phoneNumberId
          return !!(creds.accessToken && creds.phoneNumberId);
        
        case 'salla':
          // Salla needs accessToken
          return !!(creds.accessToken);
          
        default:
           // Generic check: if credentials object is not empty
           return Object.keys(creds).length > 0;
      }
    } catch (e) {
      console.error(`Failed to parse credentials for ${integration.serviceId}`, e);
      return false;
    }
  }, []);

  const refreshIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getIntegrations();
      
      if (result.success && result.data) {
        const statusMap: IntegrationStatus[] = result.data.map(integration => {
          const isConnected = checkConnection(integration);
          return {
            serviceId: integration.serviceId || "",
            isConnected,
            status: isConnected ? 'connected' : 'disconnected',
            lastSync: integration.updatedAt ? new Date(integration.updatedAt) : undefined,
            data: integration
          };
        });
        setIntegrations(statusMap);
      } else {
        setError(result.error || "Failed to fetch integrations");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [checkConnection]);

  // Initial load
  useEffect(() => {
    refreshIntegrations();
  }, [refreshIntegrations]);

  const isConnected = (serviceId: string) => {
    return integrations.find(i => i.serviceId === serviceId)?.isConnected ?? false;
  };

  const getIntegrationData = (serviceId: string) => {
    return integrations.find(i => i.serviceId === serviceId)?.data;
  };

  return {
    integrations,
    isLoading,
    error,
    refreshIntegrations,
    isConnected,
    getIntegrationData
  };
}
