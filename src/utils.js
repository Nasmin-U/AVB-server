export const cleanWord = (word) => {
  return word.replace(/[\r\n]/g, "").trim();
};
