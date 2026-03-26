import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE } from '@common/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* T_Types */
import type { T_Post } from '@common/types'
import type { Response } from '@src/types'

/**
 * Return a paginated list of posts for admin interfaces.
 *
 * Requires an admin token. Uses aggregation to expand archive references
 * and applies pagination via `PER_PAGE`.
 *
 * @param _page - 1-based page number to fetch.
 * @param token - Acess token
 * @returns A page of `T_Post` documents.
 * @throws {GraphQLError} When no posts are found.
 */
export const postsAllAdmin = async (_page: number, token: string, res: Response): Promise<T_Post[]> => {
    Logger.log(`postsAllAdmin query start`)
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const page = sanitize(_page)

    const result = await Post.aggregate<T_Post>([
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ])

    const total = await Post.countDocuments()
    res.setHeader('total-pages', Math.ceil(total / PER_PAGE))
    Logger.log(`postsAllAdmin query done`)
    return result
}
