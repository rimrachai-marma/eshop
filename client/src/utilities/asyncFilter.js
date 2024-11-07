function asyncFilter(array, asyncCondition) {
  return Promise.all(
    array.map(async (item) => (await asyncCondition(item)) || null)
  ).then((filteredArray) =>
    filteredArray.filter((filteredItem) => filteredItem !== null)
  );
}

export default asyncFilter;
