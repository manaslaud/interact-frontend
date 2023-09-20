const isArrEdited = (arr: string[], originalArr: string[]): boolean => {
  return !arr.every(element => originalArr.includes(element));
};

export default isArrEdited;
