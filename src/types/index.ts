import type { Response as expressResponse } from 'express'

/**
 * @deprecated
 */
export type Context = {
    token: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response = expressResponse<any, Record<string, any>>
export type T_Context = {
    token: string
    res: Response
}

export type T_WorkerChannels = 'test'

export type T_WorkerData<T extends T_WorkerChannels> = T extends 'test'
    ? {
          type: T
          _id: string
          token: string
      }
    : { id: number }
