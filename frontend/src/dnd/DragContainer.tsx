import update from 'immutability-helper'
import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'

import { DraggableBox } from './DraggableBox'
import type { DragItem } from './interfaces'
import { snapToGrid as doSnapToGrid } from './snapToGrid'

const styles: CSSProperties = {
  width: '100%',
  height: '100%',
  padding: '16px',
  border: '1px solid white',
  position: 'relative',
}

export interface DragContainerProps {
  snapToGrid: boolean
}

interface BoxMap {
  [key: string]: { top: number; left: number; title: string }
}

export const DragContainer: FC<DragContainerProps> = ({ snapToGrid }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(0);
  
    useEffect(() => {
      if (containerRef.current) {
        setWidth(containerRef.current?.offsetWidth);
      }
    }, []);

    
  const [boxes, setBoxes] = useState<BoxMap>({
    a: { top: 20, left: 80, title: 'Drag me around' },
    b: { top: 180, left: 20, title: 'Drag me too' },
  })

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      );

    },
    [boxes],
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'DATA_VIEW',
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number
          y: number
        }

        let left = Math.round(item.left + delta.x)
        let top = Math.round(item.top + delta.y)
        if (snapToGrid) {
          ;[left, top] = doSnapToGrid(left, top)
        }

        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox],
  )

  return (<div ref={containerRef}>

<div ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => (
        <DraggableBox
          key={key}
          id={key}
          {...(boxes[key] as { top: number; left: number; title: string })}
        />
      ))}
    </div>
  </div>
  )
}
