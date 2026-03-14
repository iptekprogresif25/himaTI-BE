import * as userModel from '../models/user.model.js'
import { comparePassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

export const login = async (
  email: string,
  password: string
) => {

  const user = await userModel.findByEmail(email)

  if (!user) {
    throw new Error('User not found')
  }

  const valid = await comparePassword(password, user.password)

  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = generateToken({
    id: user.id,
    email: user.email
  })

  return token

}
