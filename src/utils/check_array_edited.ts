const isArrEdited = (arr: string[], originalArr: string[]): boolean => {
  if (!originalArr) originalArr = [];
  return !arr.every(element => originalArr.includes(element));
};

export default isArrEdited;
