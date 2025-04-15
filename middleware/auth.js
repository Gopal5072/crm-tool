import jwt from "jsonwebtoken";

export const authenticate = (handler) => {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check user role (optional - modify as per your logic)
      if (handler.name === "GET" && req.user.role !== "sales" && req.user.role !== "founder") {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
  };
};
