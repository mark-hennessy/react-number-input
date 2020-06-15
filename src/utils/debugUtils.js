export const createInstanceLogger = (id, idToLog) => {
  if (!idToLog || idToLog === id) {
    return message => {
      console.log(`${id} - ${message}`);
    };
  }

  return () => {};
};
