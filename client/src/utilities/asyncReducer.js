async function asyncReduce(array, asyncReducerFunction, initialValue) {
  let accumulator = initialValue;

  for (const element of array) {
    accumulator = await asyncReducerFunction(accumulator, element);
  }

  return accumulator;
}

export default asyncReduce;
