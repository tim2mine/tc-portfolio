import { useEffect, useRef, type RefObject } from 'react'
import type { Point, Size } from '../state/windowManager/types'

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface UseResizableOptions {
  position: Point
  size: Size
  minSize: Size
  maxRight: number
  maxBottom: number
  onResizeEnd: (position: Point, size: Size) => void
  disabled?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/**
 * Resizes `targetRef` from any of 8 `[data-resize-dir]` handle descendants using the
 * Pointer Events API. Mutates the target's inline position/size directly during the drag
 * (no re-render) and only calls `onResizeEnd` once, on pointerup, to commit the result.
 */
export function useResizable(
  targetRef: RefObject<HTMLElement | null>,
  options: UseResizableOptions,
) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const target = targetRef.current
    if (!target || options.disabled) return

    function onPointerDown(e: PointerEvent) {
      const handleEl = (e.target as HTMLElement).closest('[data-resize-dir]') as HTMLElement | null
      if (!handleEl || e.button !== 0) return

      const dir = handleEl.dataset.resizeDir as ResizeDirection
      const { position: startPos, size: startSize } = optionsRef.current
      const startX = e.clientX
      const startY = e.clientY
      handleEl.setPointerCapture(e.pointerId)

      function compute(ev: PointerEvent): { position: Point; size: Size } {
        const { minSize, maxRight, maxBottom } = optionsRef.current
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        let x = startPos.x
        let y = startPos.y
        let width = startSize.width
        let height = startSize.height

        if (dir.includes('e')) {
          width = clamp(startSize.width + dx, minSize.width, maxRight - startPos.x)
        }
        if (dir.includes('s')) {
          height = clamp(startSize.height + dy, minSize.height, maxBottom - startPos.y)
        }
        if (dir.includes('w')) {
          const maxX = startPos.x + startSize.width - minSize.width
          x = clamp(startPos.x + dx, 0, maxX)
          width = startSize.width + (startPos.x - x)
        }
        if (dir.includes('n')) {
          const maxY = startPos.y + startSize.height - minSize.height
          y = clamp(startPos.y + dy, 0, maxY)
          height = startSize.height + (startPos.y - y)
        }

        return { position: { x, y }, size: { width, height } }
      }

      function onPointerMove(ev: PointerEvent) {
        const { position, size } = compute(ev)
        target!.style.left = `${position.x}px`
        target!.style.top = `${position.y}px`
        target!.style.width = `${size.width}px`
        target!.style.height = `${size.height}px`
      }

      function onPointerUp(ev: PointerEvent) {
        handleEl!.releasePointerCapture(e.pointerId)
        handleEl!.removeEventListener('pointermove', onPointerMove)
        handleEl!.removeEventListener('pointerup', onPointerUp)
        handleEl!.removeEventListener('pointercancel', onPointerUp)
        const { position, size } = compute(ev)
        optionsRef.current.onResizeEnd(position, size)
      }

      handleEl.addEventListener('pointermove', onPointerMove)
      handleEl.addEventListener('pointerup', onPointerUp)
      handleEl.addEventListener('pointercancel', onPointerUp)
    }

    target.addEventListener('pointerdown', onPointerDown)
    return () => target.removeEventListener('pointerdown', onPointerDown)
  }, [targetRef, options.disabled])
}
