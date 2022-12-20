import { LatLngExpression } from "leaflet"
import { useCallback, useMemo, useRef, useState } from "react"
import { Marker, Popup } from "react-leaflet"

export interface DraggableMarkerProps {
    position: LatLngExpression
    icon: L.Icon
    draggable?: boolean
    onDragged?: (position: L.LatLng) => void
}

export function DraggableMarker(props:DraggableMarkerProps) {
    //const [draggable, setDraggable] = useState(false)
    //const [position, setPosition] = useState(props.position)
    const markerRef = useRef<L.Marker>(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    let pos = marker.getLatLng()
                    //setPosition(pos)
                    if (props.onDragged) props.onDragged(pos)
                }
            },
        }),
        []
    )
    // const toggleDraggable = useCallback(() => {
    //     setDraggable((d) => !d)
    // }, [])

    console.log('DraggableMarker render().. position=', props.position)
    return (
        <Marker
            draggable={props.draggable}
            eventHandlers={eventHandlers}
            position={props.position}
            ref={markerRef}
            icon={props.icon}
        >
            {/* <Popup minWidth={90}>
                <span onClick={toggleDraggable}>
                    {draggable ? 'Marker is draggable' : 'Click here to make marker draggable'}
                </span>
            </Popup> */}
        </Marker>
    )
}
