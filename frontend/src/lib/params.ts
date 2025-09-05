import { ESortBy, QueryObject } from "@/types/models";
import qs from "qs";

export const buildMediaQueryParams = (query?: QueryObject) => {
  const q = createMediaQueryObject(query);
  console.log("q", q, query);
  return qs.stringify(q, { skipNulls: true });
};

export function createMediaQueryObject(query?: QueryObject): QueryObject {
  const MAX_PAGE_SIZE = 100;
  console.log("createMediaQueryObject", query);

  if (!query) return {};

  return {
    ...query,
    pageNumber: query.pageNumber ?? 1,
    search: query.search,
    pageSize: Math.min(query.pageSize ?? 10, MAX_PAGE_SIZE),
  };
}
