import type { ComponentType } from 'react'
import type { Point, Size } from '../state/windowManager/types'

export interface AppConfig {
  id: string
  title: string
  icon: string
  iconLabel: string
  defaultPosition: Point
  defaultSize: Size
  component: ComponentType
  showOnDesktop?: boolean
  showInStartMenu?: boolean
}
