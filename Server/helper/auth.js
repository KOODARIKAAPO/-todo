import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
  const raw = req.headers["authorization"] || ""
  const token = raw.startsWith("Bearer ") ? raw.substring(7) : raw

  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" })
    }
    next()
  })
}
