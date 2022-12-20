export const GeofenceType = {
    CIRCLE: 'CIRCLE',
    RECTANGLE: 'RECTANGLE',
    POLYGON: 'POLYGON'
}

type t = typeof GeofenceType
export type GeofenceTypes = t[keyof t];

//export type GeofenceTypes = GeofenceType.CIRCLE | GeofenceType.RECTANGLE | GeofenceType.POLYGON