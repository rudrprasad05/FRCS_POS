import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import hash from "object-hash";
import { toast } from "sonner";
import { PosSession } from "@/types/models";

const PosSessionContext = createContext<{
  data: Partial<PosSession>;
  isSaving: boolean;
  setInitialState: (data: Partial<PosSession>) => void;
  updateValues: <K extends keyof PosSession>(
    key: K,
    value: PosSession[K]
  ) => void;
  save: () => void;
  hasChanged: boolean;
  setHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  data: {},
  isSaving: false,
  setInitialState: () => {},
  updateValues: () => {},
  save: () => {},
  hasChanged: false,
  setHasChanged: () => {},
});

export const PosSessionProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Partial<PosSession>>({});
  const [hasChanged, setHasChanged] = useState(false);
  const initialHashRef = useRef<string>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentHash = hash(data);
    if (!initialHashRef.current) {
      initialHashRef.current = currentHash;
    }
    setHasChanged(currentHash !== initialHashRef.current);
  }, [data]);

  function setInitialState(inti: Partial<PosSession>) {
    console.log("hit3_a", inti);
    if (data == inti) return;
    console.log("hit3");
    setData(inti);
    initialHashRef.current = hash(inti);
  }

  function updateValues<K extends keyof PosSession>(
    key: K,
    value: PosSession[K]
  ) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function save() {
    setIsSaving(true);
    try {
      initialHashRef.current = hash(data);
      setHasChanged(false);

      toast.success("Saved successfully");
    } catch (error) {
      toast.error("Error ocured. Changes not saved");
    }
    setIsSaving(false);
  }

  return (
    <PosSessionContext.Provider
      value={{
        data,
        isSaving,
        setInitialState,
        updateValues,
        save,
        hasChanged,
        setHasChanged,
      }}
    >
      {children}
    </PosSessionContext.Provider>
  );
};

// Hook to use cake context
export const usePosSession = () => useContext(PosSessionContext);
