"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface MetaData {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface GenericDataContextType<T> {
  items: T[];
  loading: boolean;
  pagination: MetaData;
  setPagination: React.Dispatch<React.SetStateAction<MetaData>>;
  refresh: () => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

export function createGenericDataContext<T>() {
  const Context = createContext<GenericDataContextType<T>>({
    items: [],
    loading: true,
    pagination: { pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
    setPagination: () => {},
    refresh: async () => {},
    setItems: () => {},
  });

  const Provider = ({
    children,
    fetchFn,
    initialPageSize = 10,
  }: {
    children: ReactNode;
    fetchFn: (
      pageNumber: number,
      pageSize: number
    ) => Promise<{
      data: T[];
      meta?: { totalCount: number };
    }>;
    initialPageSize?: number;
  }) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<MetaData>({
      pageNumber: 1,
      pageSize: initialPageSize,
      totalCount: 0,
      totalPages: 0,
    });

    const refresh = async () => {
      setLoading(true);
      const res = await fetchFn(pagination.pageNumber, pagination.pageSize);
      setItems(res.data ?? []);
      setPagination((prev) => ({
        ...prev,
        totalCount: res.meta?.totalCount ?? res.data.length,
        totalPages: Math.ceil(
          (res.meta?.totalCount ?? res.data.length) / prev.pageSize
        ),
      }));
      setLoading(false);
    };

    useEffect(() => {
      refresh();
    }, [pagination.pageNumber, pagination.pageSize]);

    return (
      <Context.Provider
        value={{ items, loading, pagination, setPagination, refresh, setItems }}
      >
        {children}
      </Context.Provider>
    );
  };

  const useGenericData = () => useContext(Context);

  return { Provider, useGenericData };
}
