export interface MemberLocation {
    location_id: string | null
    location_name: string
    location_code: string
    location_type_id: string
    location_type_name?: string
    address: string
    lon: number | null
    lat: number | null
    radius: number | null
    geofence_type?: string
    geofence_points?: Array<{ x: number, y: number }> | null
    description: string
}
