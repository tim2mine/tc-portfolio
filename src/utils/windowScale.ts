import type { Size } from '../state/windowManager/types'

export const MIN_RESIZE_SCALE = 1
export const MAX_RESIZE_SCALE = 2

// How far a window has grown past its own default size, so fixed-px content (fonts,
// rows, icons) scales up to fill the extra space instead of staying pinned at a fixed
// size in a growing empty box. Capped so very large windows don't get absurd text.
export function computeResizeScale(size: Size, defaultSize: Size): number {
  const scaleW = size.width / defaultSize.width
  const scaleH = size.height / defaultSize.height
  return Math.min(MAX_RESIZE_SCALE, Math.max(MIN_RESIZE_SCALE, Math.min(scaleW, scaleH)))
}
