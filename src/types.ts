import type { Router } from 'express'
import type { Application } from 'express-ws'

export type ValueType<T extends Record<any, any>> = T[keyof T]
export type KeysOfUnion<T> = T extends T ? keyof T : never

export type Configuration = any

export type WebSocketPacketData = any

export type ShutdownFunction = () => Promise<void>

export type MPDSubscriber = (data: any) => void

export type MPDUnsubscriber = () => void

export type MPDPublisher = (pkg: string, data?: any) => void

export interface MPDContext {
    app: Application
    router: Router
    subscribe: (fn: MPDSubscriber) => MPDUnsubscriber
    send: MPDPublisher
    config: Configuration
}

export interface MPD {
    register: (ctx: MPDContext) => Promise<ShutdownFunction>
}

export type AnyClient = any
