import AppError from "../utils/appError.mjs";

export const requireRole = (requiredRole) => {
    return (req, res, next) => {
        console.log("req.user.role.name", req.user);
        if (req.user.role !== requiredRole) {
            return next(
                new AppError("Forbidden: Insufficient permissions", 403)
            );
        }
        next();
    };
};
