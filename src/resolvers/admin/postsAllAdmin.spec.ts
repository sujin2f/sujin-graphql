/**
 * yarn test postsAllAdmin.spec.ts
 */

import type { Response } from '@src/types'

// Mock Post model
import { PostMock } from '@test/mocks/GQL-model'
jest.doMock('@src/schema/post', () => PostMock)
import { Post } from '@src/schema/post'
// Mock security.ts
import SecurityMock from '@test/mocks/utils/security'
jest.doMock('@src/utils/security', () => SecurityMock)
import { verifyAccessToken } from '@src/utils/security'
// Mock Logger
import LoggerMock from '@test-common/mock.logger'
jest.doMock('@common/model/Logger', () => LoggerMock)

import { postsAllAdmin } from './postsAllAdmin'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('postsAllAdmin', () => {
    it('returns posts when Post.aggregate resolves with results', async () => {
        expect(true).toBe(true)
        const fakePosts = [{ id: 1, title: 'Hello' }]
        ;(Post.aggregate as jest.Mock).mockResolvedValue(fakePosts)
        ;(verifyAccessToken as jest.Mock).mockResolvedValue({ sub: { admin: true } })

        const result = await postsAllAdmin(1, 'admin-token', { setHeader: jest.fn() } as unknown as Response)

        expect(verifyAccessToken).toHaveBeenCalledWith('admin-token')
        expect(Post.aggregate).toHaveBeenCalled()
        expect(result).toEqual(fakePosts)
    })

    it('returns [] when no posts found', async () => {
        ;(Post.aggregate as jest.Mock).mockResolvedValue([])
        ;(verifyAccessToken as jest.Mock).mockResolvedValue({ admin: true })

        expect(await postsAllAdmin(1, 'admin-token', { setHeader: jest.fn() } as unknown as Response)).toStrictEqual([])
        expect(verifyAccessToken).toHaveBeenCalled()
    })
})
