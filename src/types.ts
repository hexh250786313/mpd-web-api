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

export interface IPauseStatus {
    repeat: boolean
    random: boolean
    single: boolean
    consume: boolean
    partition: string
    playlist: number
    playlistlength: number
    mixrampdb: number
    state: string
    time?: never
    songid?: never
}

export interface IPlayStatus {
    volume: number
    repeat: boolean
    random: boolean
    single: boolean
    consume: boolean
    partition: string
    playlist: number
    playlistlength: number
    mixrampdb: number
    state: string
    song: number
    songid: number
    time: {
        elapsed: number
        total: number
    }
    elapsed: number
    duration: number
    audio: {
        sample_rate: number
        bits: number
        channels: number
        sample_rate_short: {
            value: number
            unit: string
        }
        original_value: string
    }
}

export type IPlaying = IPlayStatus | IPauseStatus
