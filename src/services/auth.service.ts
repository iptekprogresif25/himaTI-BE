import * as userModel from '../models/user.model.js'
import { comparePassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

export const login = async (
  email: string,
  password: string
) => {
  try {
    const user = await userModel.findByEmail(email)

    if (!user) {
      return {
        success: false,
        status: 401,
        message: 'email atau password salah',
        data: null
      }
    }

    const valid = await comparePassword(password, user.password)

    if (!valid) {
      return {
        success: false,
        status: 401,
        message: 'email atau password salah',
        data: null
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email
    })

    return {
      success: true,
      status: 200,
      message: 'Login success',
      data: {
        token
      }
    }

  } catch (error) {
    return {
      success: false,
      status: 500,
      message: 'Internal server error',
      data: null
    }
  }
}