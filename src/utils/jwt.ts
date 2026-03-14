import jwt from 'jsonwebtoken';
import "dotenv/config";

export const generateToken = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1h'
    })
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (err) {
    throw err
  }
}