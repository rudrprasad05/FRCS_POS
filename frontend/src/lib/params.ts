import { ESortBy, QueryObject } from "@/types/models";
import qs from "qs";

export const buildMediaQueryParams = (query?: QueryObject) => {
  const q = createMediaQueryObject(query);
  return qs.stringify(q, { skipNulls: true });
};

export function createMediaQueryObject(query?: QueryObject): QueryObject {
  const MAX_PAGE_SIZE = 100;

  if (!query)
    return {
      sortBy: ESortBy.ASC,
    };

  return {
    sortBy: query.sortBy,
    pageNumber: query.pageNumber ?? 1,
    pageSize: Math.min(query.pageSize ?? 10, MAX_PAGE_SIZE),
    showInGallery: query.showInGallery,
    isDeleted: query.isDeleted,
    role: query.role,
  };
}
