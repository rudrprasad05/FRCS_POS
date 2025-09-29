"use client";
import { ApiResponse, ESortBy, QueryObject } from "@/types/models";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// --- Pagination metadata ---
export interface MetaData {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  search?: string;
  sortBy?: ESortBy;
  isDeleted?: boolean;
}

export const DefaultMetaData: MetaData = {
  pageNumber: 1,
  pageSize: 10,
  totalCount: 10,
  totalPages: 1,
  search: undefined,
  sortBy: undefined,
  isDeleted: undefined,
};

// --- Single item context ---
export interface GenericSingleDataContextType<T> {
  item: T | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setItem: React.Dispatch<React.SetStateAction<T | null>>;
}

// --- List context ---
export interface GenericListDataContextType<T> {
  items: T[];
  loading: boolean;
  pagination: MetaData;
  setPagination: React.Dispatch<React.SetStateAction<MetaData>>;
  refresh: () => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

// --- Factory for single-item context ---
export function createGenericSingleDataContext<T>() {
  const Context = createContext<GenericSingleDataContextType<T>>({
    item: null,
    loading: true,
    refresh: async () => {},
    setItem: () => {},
  });

  const Provider = ({
    children,
    fetchFn,
  }: {
    children: ReactNode;
    fetchFn: () => Promise<ApiResponse<T>>;
  }) => {
    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
      setLoading(true);
      const res = await fetchFn();
      setItem(res.data ?? null);
      setLoading(false);
    }, [fetchFn, setLoading]);

    useEffect(() => {
      refresh();
    }, [refresh]);

    if (item == null || item == undefined) {
      return <>loading</>;
    }

    return (
      <Context.Provider value={{ item, loading, refresh, setItem }}>
        {children}
      </Context.Provider>
    );
  };

  const useGenericData = () => useContext(Context);

  return { Provider, useGenericData };
}

// --- Factory for list-item context ---
export function createGenericListDataContext<T>() {
  const Context = createContext<GenericListDataContextType<T>>({
    items: [],
    loading: true,
    pagination: DefaultMetaData,
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
    fetchFn: (query: QueryObject) => Promise<ApiResponse<T[]>>;
    initialPageSize?: number;
  }) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<MetaData>({
      pageNumber: 1,
      pageSize: initialPageSize,
      totalCount: 0,
      totalPages: 0,
      search: "",
    });

    const refresh = useCallback(async () => {
      setLoading(true);

      const res = await fetchFn({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        search: pagination.search,
        isDeleted: pagination.isDeleted,
        sortBy: pagination.sortBy,
      });

      setItems(res.data ?? []);

      setPagination((prev) => ({
        ...prev,
        totalCount: res.meta?.totalCount ?? (res.data?.length as number),
        totalPages: Math.ceil(
          (res.meta?.totalCount ?? (res.data?.length as number)) / prev.pageSize
        ),
      }));

      setLoading(false);
    }, [setLoading, pagination, setPagination, fetchFn]);

    useEffect(() => {
      refresh();
    }, [
      pagination.pageNumber,
      pagination.pageSize,
      pagination.search,
      pagination.sortBy,
      pagination.isDeleted,
      refresh,
    ]);

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
