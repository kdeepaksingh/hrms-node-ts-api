export const buildQuery = (query: any, searchFields: string[] = []) => {
  const mongoQuery: any = {};
  if (query.search) {
    mongoQuery["$or"] = searchFields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" },
    }));
  }

  // Add filters like ?status=Pending
  Object.keys(query).forEach((key) => {
    if (!["search", "sort", "page", "limit"].includes(key)) {
      mongoQuery[key] = query[key];
    }
  });

  return mongoQuery;
};

export const getPagination = (query: any) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;
  return { skip, limit };
};
