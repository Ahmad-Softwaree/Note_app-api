export const sqlQuery = (query, body) => {
  return {
    query: `${query}`,
    values: [...Object.values(body)],
  };
};
