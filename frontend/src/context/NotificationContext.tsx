"use client";

import hash from "object-hash";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

// Create context
const NotificationContext = createContext<{
  notifications: Partial<Notification>[];
  setInitialState: (data: Notification[]) => void;
  updateValues: <K extends keyof Notification>(
    key: K,
    value: Notification[K]
  ) => void;
  saveContext: () => void;
  hasChanged: boolean;
  setHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  notifications: [],
  setInitialState: () => {},
  updateValues: () => {},
  saveContext: () => {},
  hasChanged: false,
  setHasChanged: () => {},
});

// Provider
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Partial<Notification>[]>(
    []
  );
  const [hasChanged, setHasChanged] = useState(false);
  const initialHashRef = useRef<string>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentHash = hash(notifications);
    if (!initialHashRef.current) {
      initialHashRef.current = currentHash;
    }
    setHasChanged(currentHash !== initialHashRef.current);
  }, [notifications]);

  function setInitialState(notifications: Partial<Notification>[]) {
    setNotifications(notifications);
    initialHashRef.current = hash(notifications);
  }

  function updateValues<K extends keyof Notification>(
    key: K,
    value: Notification[K]
  ) {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveContext() {
    setIsSaving(true);
    try {
      initialHashRef.current = hash(notifications);
      setHasChanged(false);

      toast.success("Saved successfully");
    } catch (error) {
      toast.error("Error ocured. Changes not saved");
    }
    setIsSaving(false);
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setInitialState,
        updateValues,
        saveContext,
        hasChanged,
        setHasChanged,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications context
export const useCake = () => useContext(NotificationContext);
