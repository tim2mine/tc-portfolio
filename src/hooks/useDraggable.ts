import { useEffect, useRef, type RefObject } from 'react'
import type { Point } from '../state/windowManager/types'

export interface DragBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface UseDraggableOptions {
  position: Point
  onDragEnd: (position: Point) => void
  disabled?: boolean
  bounds?: DragBounds
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/**
 * Drags `targetRef` by its `handleRef` using the Pointer Events API.
 * Mutates the target's inline position directly during the drag (no re-render)
 * and only calls `onDragEnd` once, on pointerup, to commit the final position.
 */
export function useDraggable(
  handleRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  { position, onDragEnd, disabled, bounds }: UseDraggableOptions,
) {
  const positionRef = useRef(position)
  positionRef.current = position

  const onDragEndRef = useRef(onDragEnd)
  onDragEndRef.current = onDragEnd

  const boundsRef = useRef(bounds)
  boundsRef.current = bounds

  useEffect(() => {
    const handle = handleRef.current
    const target = targetRef.current
    if (!handle || !target || disabled) return

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest('[data-no-drag]')) return

      const startX = e.clientX
      const startY = e.clientY
      const startPos = positionRef.current
      handle!.setPointerCapture(e.pointerId)

      function onPointerMove(ev: PointerEvent) {
        const b = boundsRef.current
        let x = startPos.x + (ev.clientX - startX)
        let y = startPos.y + (ev.clientY - startY)
        if (b) {
          x = clamp(x, b.minX, b.maxX)
          y = clamp(y, b.minY, b.maxY)
        }
        target!.style.left = `${x}px`
        target!.style.top = `${y}px`
      }

      function onPointerUp(ev: PointerEvent) {
        handle!.releasePointerCapture(e.pointerId)
        handle!.removeEventListener('pointermove', onPointerMove)
        handle!.removeEventListener('pointerup', onPointerUp)
        handle!.removeEventListener('pointercancel', onPointerUp)

        const b = boundsRef.current
        let x = startPos.x + (ev.clientX - startX)
        let y = startPos.y + (ev.clientY - startY)
        if (b) {
          x = clamp(x, b.minX, b.maxX)
          y = clamp(y, b.minY, b.maxY)
        }
        onDragEndRef.current({ x, y })
      }

      handle!.addEventListener('pointermove', onPointerMove)
      handle!.addEventListener('pointerup', onPointerUp)
      handle!.addEventListener('pointercancel', onPointerUp)
    }

    handle.addEventListener('pointerdown', onPointerDown)
    return () => handle.removeEventListener('pointerdown', onPointerDown)
  }, [handleRef, targetRef, disabled])
}
