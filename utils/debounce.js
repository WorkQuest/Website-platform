export default (originalFn, timeoutMs = 0) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout); // clear timeout every time the function is called
    // call the original function once "timeoutMs" ms after the last call have elapsed
    timeout = setTimeout(() => originalFn(...args), timeoutMs);
  };
};
