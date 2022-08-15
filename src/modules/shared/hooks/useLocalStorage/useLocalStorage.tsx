export const useLocalStorage = () => {
  function setStorage<T>(key: string, value: T): void {
    const valueStringified = JSON.stringify(value);
    window.localStorage.setItem(key, `{"value":${valueStringified}}`);
  }

  const deleteKey = (key: string): void => {
    window.localStorage.removeItem(key);
  };

  function getItem<T>(key: string): T {
    let jsonParsed;
    const value = window.localStorage.getItem(key);
    if (value != null) {
      jsonParsed = JSON.parse(value).value;
    } else jsonParsed = null;
    return jsonParsed;
  }

  return { setStorage, getItem, deleteKey };
};
