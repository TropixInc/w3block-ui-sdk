export const changeDynamicJsonToInsertIndex = (json: any, index: number) => {
  let stringJSON = JSON.stringify(json);

  stringJSON = stringJSON.replaceAll(/{index}/g, index.toString());
  return JSON.parse(stringJSON);
};
