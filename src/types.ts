import type { Router } from 'express'
import type { Application } from 'express-ws'

export type Configuration = any

export type WebSocketPacketData = any

export type ShutdownFunction = () => Promise<void>

export type MpdSubscriber = (data: any) => void

export type MpdUnsubscriber = () => void

export type MpdPublisher = (pkg: string, data?: any) => void

export interface MpdContext {
  app: Application
  router: Router
  subscribe: (fn: MpdSubscriber) => MpdUnsubscriber
  send: MpdPublisher
  config: Configuration
}

export interface Mpd {
  register: (ctx: MpdContext) => Promise<ShutdownFunction>
}

export type AnyClient = any
