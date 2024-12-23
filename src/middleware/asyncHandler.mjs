// Wrap async route handlers so errors are passed to errorHandler automatically
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  export default asyncHandler;
  