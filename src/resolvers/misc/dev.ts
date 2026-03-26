/* eslint-disable */

import { IS_DEV } from '@common/constants/helper'

export const test = async () => {
    if (!IS_DEV) {
        throw new Error('invalid access')
    }
}
