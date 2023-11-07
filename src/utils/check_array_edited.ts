const isArrEdited = (arr1: string[], arr2: string[]): boolean => {
  if (!arr1) arr1 = [];
  if (!arr2) arr2 = [];

  if (arr1.length !== arr2.length) {
    return true;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return true;
    }
  }

  return false;
};

export default isArrEdited;
