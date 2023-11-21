export const asynchandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error)=>next(error));

// const asynchandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.status || 500).json({
//         message: error.message,
//         success:false
//     })
//   }
// };

