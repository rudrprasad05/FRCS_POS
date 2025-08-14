"use client";
import { GetAllAdmins } from "@/actions/User";
import { User, MetaData } from "@/types/models";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserDataContextType {
  users: User[];
  loading: boolean;
  pagination: MetaData;
  setPagination: React.Dispatch<React.SetStateAction<MetaData>>;
  refresh: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType>({
  users: [],
  loading: true,
  pagination: {
    pageNumber: 1,
    totalCount: 1,
    pageSize: 10,
    totalPages: 0,
  },
  setPagination: () => {},
  refresh: async () => {},
});

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<MetaData>({
    pageNumber: 1,
    totalCount: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const refresh = async () => {
    setLoading(true);
    setUsers([]);
    const res = await GetAllAdmins({
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    });

    setUsers(res.data || []);
    setPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(
        (res.meta?.totalCount as number) / pagination.pageSize
      ),
    }));
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [pagination.pageNumber, pagination.pageSize]);

  return (
    <UserDataContext.Provider
      value={{ users, loading, pagination, setPagination, refresh }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUsers = () => useContext(UserDataContext);
