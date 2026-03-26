/* Models */
import { Logger } from '@common/model/Logger'
/* Utils */
import { generateToken, verifyToken } from '@common/utils/token'
import { verifyAdmin } from '@src/utils/security'
/* T_Type */
import type { Response } from '@src/types'
import type { T_UserSub } from '@common/types'
/* CONSTANTS */
import { ACCESS_TOKEN_LIFETIME, HEADER_TOKEN } from '@common/constants'

const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const REFRESH_SECRET = `${process.env.REFRESH_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

/**
 * Verify refresh token and issue a new access token
 *
 * @param {string} token - Refresh token.
 * @throws {Error} When the incoming token is missing or invalid.
 */
export const refresh = async (token: string, res: Response): Promise<boolean> => {
    Logger.log(`refresh token has been attempted`)
    if (!token) return false

    const user = await verifyToken<T_UserSub>(token.slice(7), REFRESH_SECRET, CRYPTO_KEY).catch((e) => {
        throw Logger.throw(e)
    })
    if (user.admin) {
        await verifyAdmin(user.email).catch(() => {
            throw Logger.throw('🤬 Malformed admin access: ', JSON.stringify(user))
        })
    }

    const accessToken = await generateToken(user, ACCESS_TOKEN_LIFETIME, ACCESS_SECRET, CRYPTO_KEY)
    res.setHeader(HEADER_TOKEN, `Bearer ${accessToken}`)
    Logger.log(`refresh token has been finished`)
    return true
}
