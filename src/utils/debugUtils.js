export const createInstanceLogger = (id, idToLog) => {
  if (!idToLog || idToLog === id) {
    return (...messages) => {
      console.log(id, ...messages);
    };
  }

  return () => {};
};
