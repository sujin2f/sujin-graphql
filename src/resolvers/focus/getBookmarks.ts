import { Types } from 'mongoose'
/* Models */
import { Focus, FocusBookmark } from '@src/schema/focus'
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Bookmark, T_Focus_Message } from '@common/types'
/* CONSTANTS */
import { HOUR_IN_MS, MINUTE_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { getCache, setCache } from '@src/utils/redis/cache'
import { COLLECTION } from '@common/constants'

/**
 * @deprecated Backward compatibility
 */
export const getBookmarks = async (token: string): Promise<T_Focus_Message[]> => {
    const user = await verifyAccessToken(token)

    return await Focus.find({ user: new Types.ObjectId(user._id), type: 'bookmark' })
        .then(async (result) => {
            const now = Math.round(new Date().getTime() / HOUR_IN_MS)
            const items = result
                .filter(async (item) => {
                    // Remove expired
                    if (item.expires < now) {
                        await Focus.deleteOne({ _id: item._id })
                        return false
                    }
                    return true
                })
                .map(
                    (item) =>
                        ({
                            _id: item._id.toString(),
                            key: item.key,
                            title: item.title,
                            device: item.device,
                            machineId: item.machineId,
                            type: item.type,
                            message: item.message,
                        }) satisfies T_Focus_Message,
                )
            Logger.log('getBookmarks() attempted', user.email, items.length)
            setCache(JSON.stringify(items), `${COLLECTION.BOOKMARK}-${user.email}`, 30 * MINUTE_IN_SECONDS)
            return items
        })
        .catch((e) => {
            Logger.error('getBookmarks() failed', user.email, e.message)
            setCache(JSON.stringify([]), `${COLLECTION.BOOKMARK}-${user.email}`, 30 * MINUTE_IN_SECONDS)
            return []
        })
}

export const getBookmarks2 = async (token: string): Promise<T_Bookmark[]> => {
    const user = await verifyAccessToken(token)
    const key = `${COLLECTION.BOOKMARK}2-${user.email}`

    const bookmarks = await getCache(key).catch(() => '')
    if (bookmarks) return JSON.parse(bookmarks) as T_Bookmark[]

    return await FocusBookmark.find({ user: new Types.ObjectId(user._id), type: 'bookmark' })
        .then(async (result) => {
            Logger.log('getBookmarks2() attempted', result.length)
            setCache(JSON.stringify(result), `${COLLECTION.BOOKMARK}2-${user.email}`, 30 * MINUTE_IN_SECONDS)
            return result
        })
        .catch((e) => {
            Logger.error('getBookmarks2() failed', user.email, e.message)
            setCache(JSON.stringify([]), `${COLLECTION.BOOKMARK}-${user.email}`, 30 * MINUTE_IN_SECONDS)
            return []
        })
}
