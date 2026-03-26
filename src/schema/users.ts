import mongoose from 'mongoose'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'
/* T_Types */
import type { T_User } from '@common/types'

const { Schema, model } = mongoose

/**
 * Simple user schema used to store authenticated users by email.
 *
 * Only `email` is currently stored; the field is unique and indexed.
 */
const usersSchema = new Schema<T_User>({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    admin: Boolean,
})

/**
 * Exported model `User`
 */
export const User = model(COLLECTION.USERS, usersSchema)
