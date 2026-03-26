/* Utils */
import { getDevices } from './getDevices'
import { removeDevices } from './removeDevices'
import { getPages } from './getPages'
import { postsAllAdmin } from '@src/resolvers/admin/postsAllAdmin'
/* T_Types */
import type { T_Context } from '@src/types'
import type { T_GQL_Params_Page } from '@common/types'

/**
 * Focus resolvers that belongs to Focus Browser.
 */
export const admin = {
    Query: {
        focusDevices: async (_: unknown, { page }: { page: number }, context: T_Context) =>
            await getDevices(page, context.token, context.res),
        pages: async (_: unknown, { page }: { page: number }, context: T_Context) =>
            await getPages(page, context.token, context.res),
        postsAllAdmin: async (_: unknown, { page }: T_GQL_Params_Page, context: T_Context) =>
            await postsAllAdmin(page, context.token, context.res),
    },
    Mutation: {
        focusRemoveDevices: async (_: unknown, __: unknown, context: T_Context) => await removeDevices(context.token),
    },
}
