import { Button } from '@progress/kendo-react-buttons'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs'
import { Field, FieldRenderProps, Form, FormElement } from '@progress/kendo-react-form'
import axios from 'axios'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { LatLng, LatLngBounds, LatLngExpression, LeafletEventHandlerFn } from 'leaflet'
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer'
import { Loader as GoogleApiLoader } from '@googlemaps/js-api-loader'
import { withValueField } from '../../shared/components/withValueField'
import { ComboBox } from '@progress/kendo-react-dropdowns'
import { MemberLocation } from '../../interfaces/MemberLocation'
import { HookFormInput } from '../../shared/components/ReactHookForm/HookFormInput'
import { HookFormComboBoxWithRemoteData } from '../../shared/components/ReactHookForm/HookFormComboBoxRemoteData'
import { HookFormTextArea } from '../../shared/components/ReactHookForm/HookFormTextArea'
import { HookFormNumericTextBox } from '../../shared/components/ReactHookForm/HookFormNumericTextBox'
import { HookFormDropDownList } from '../../shared/components/ReactHookForm/HookFormDropDownList'
import { useForm } from 'react-hook-form'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'
import { DraggableMarker } from '../../shared/components/Map/DraggableMarker'
import { GeofenceType, GeofenceTypes } from '../../interfaces/GeofenceType'
import { loadGridData } from '../location-type/LocationTypeSlice'

interface ILocationFormProps {
    mode: string
    title: string
    dataId: string
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

const GOOGLE_API_KEY = 'AIzaSyAGy5uZ8NeTFhU0-fKJO5N44a_Vf6vJHwM'

// indonesia
const southWest = L.latLng(-11.0, 95.0)
const northEast = L.latLng(6.0, 141.0)
const initialBounds = L.latLngBounds(southWest, northEast)

function LocationForm(props: ILocationFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const [formData, setFormData] = useState<MemberLocation>({
        location_id: null,
        location_name: '',
        location_code: '',
        location_type_id: '',
        address: '',
        description: '',
        lon: null,
        lat: null,
        geofence_type: GeofenceType.CIRCLE,
        geofence_points: null,
        radius: null,
    })
    const [formState, setFormState] = useState('init') // loading, submitting, submitted
    const [errorMessage, setErrorMessage] = useState('')
    const [map, setMap] = useState<Map | null>(null)
    //const [google, setGoogle] = useState(null)
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
    const [locationMarker, setLocationMarker] = useState<L.Marker | null>(null)
    const [locationLat, setLocationLat] = useState<number | null>(null)
    const [locationLon, setLocationLon] = useState<number | null>(null)
    const [geofenceType, setGeofenceType] = useState<GeofenceTypes>(GeofenceType.CIRCLE)
    const [geofenceRadius, setGeofenceRadius] = useState<number | null>(null)

    const rectangleGeofence = useRef<L.Rectangle | null>(null)
    const polygonGeofence = useRef<L.Polygon | null>(null)
    const editableLayer = useRef<L.Layer | null>(null)

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        control,
        watch,
        getValues,
        formState: { errors },
    } = useForm()

    //console.log(watch())

    const geofenceShapes = [
        { id: GeofenceType.CIRCLE, text: t('Circle') },
        { id: GeofenceType.RECTANGLE, text: t('Rectangle') },
        { id: GeofenceType.POLYGON, text: t('Polygon') },
    ]

    useEffect(() => {
        const loader = new GoogleApiLoader({
            apiKey: GOOGLE_API_KEY,
            version: 'weekly',
            libraries: [],
        })
        loader.load().then((google) => {
            let g = new google.maps.Geocoder()
            setGeocoder(g)
            console.log('Geocoder set!')
        })
    }, [])

    useEffect(() => {
        if (mode === 'edit') {
            // load data
            loadData()
        } else {
            setFormState('')
        }
    }, [mode])

    useEffect(() => {
        // fill form with formData if formData loaded
        reset(formData)
    }, [formData])

    useEffect(() => {
        console.log('useEffect() locationLat:', locationLat, 'locationLon:', locationLon)
        if (map) {
            drawMarker()
            drawGeofence() // circle geofence should be updated
        } else {
            console.log('-- map null--', map)
        }
    }, [map, locationLat, locationLon])

    useEffect(() => {
        console.log('useEffect() to draw geofence')
        if (map) {
            drawGeofence()
            //setGeofenceLayer(layer)
        } else {
            console.log('-- map null--', map)
        }
    }, [map, geofenceType, geofenceRadius])

    function loadData() {
        console.log('loadData().. dataId = ' + dataId)
        setFormState('loading')
        let url = `api/Location/${dataId}`
        axios
            .get(url)
            .then((response) => {
                const data = response.data
                console.log('Data loaded. ', data)
                // create geofence first, so it can be displayed 
                if (data.geofence_type === GeofenceType.RECTANGLE) {
                    // create rectangle
                    if (data.geofence_points) {
                        var points = data.geofence_points.map((p: { x: number, y: number }) => L.latLng(p.y, p.x))
                        var bounds = L.latLngBounds([points[0], points[2]])
                        rectangleGeofence.current = L.rectangle(bounds)
                    }
                    else {
                        rectangleGeofence.current = null
                    }
                    //rectangleGeofence.current = L.rectangle()
                }
                else if (data.geofence_type === GeofenceType.POLYGON) {
                    // create polygon
                    if (data.geofence_points)
                        polygonGeofence.current = L.polygon(data.geofence_points.map((p: { x: number, y: number }) => L.latLng(p.y, p.x)))
                    else
                        polygonGeofence.current = null
                }
                setFormData(data)
                setFormState('')
                setLocationLat(data.lat)
                setLocationLon(data.lon)
                setGeofenceType(data.geofence_type)
                setGeofenceRadius(data.radius)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(t('FailedToLoadData'))
                setFormState('error')
            })
    }

    const onSubmit = handleSubmit((data) => {
        console.log('onSubmit() data = ', data)
        setErrorMessage('')
        setFormState('submitting')
        let url = 'api/Location/'
        if (mode === 'add') url = url + 'add'
        else url = url + 'update'
        console.log(`url = ${url}, dataId = ${dataId}`)
        //var data = e.values
        data.location_id = dataId
        if (data.geofence_type === GeofenceType.POLYGON) {
            var polygon = editableLayer.current as L.Polygon;
            var points = polygon?.getLatLngs()
            console.log('points:', points);
            if (points.length > 0) {
                var innerPoints = points[0] as L.LatLng[]
                var geofencePoints: Array<{ x: number, y: number }> = innerPoints.map((latLng) => { return { x: latLng.lng, y: latLng.lat } });
                console.log('geofencePoints:', geofencePoints)
                data.geofence_points = geofencePoints
            }
            else {
                data.geofence_points = []
            }
            
            //data.geofence_points = polygon?.getLatLngs()
        }
        else if (data.geofence_type === GeofenceType.RECTANGLE) {
            var rectangle = editableLayer.current as L.Rectangle
            var points = rectangle.getLatLngs()
            console.log('points:', points);
            if (points.length > 0) {
                var innerPoints = points[0] as L.LatLng[]
                var geofencePoints: Array<{ x: number, y: number }> = innerPoints.map((latLng) => { return { x: latLng.lng, y: latLng.lat } });
                console.log('geofencePoints:', geofencePoints)
                data.geofence_points = geofencePoints
            }
            else {
                data.geofence_points = []
            }
            //data.geofence_points = (editableLayer.current as L.Rectangle)?.getLatLngs()
        }
        // var data = {
        //     location_id: dataId,
        //     location_type_name: e.values.locationTypeName,
        //     icon: e.values.locationIcon,
        //     icon_color: e.values.locationIconColor,
        // }
        axios
            .post(url, data)
            .then((response) => {
                console.log(response)
                // setSubmitting false
                if (response.data.success) {
                    setFormState('submitted')
                    // close form, display success message
                    if (onSuccess) onSuccess(data, response.data.result)
                } else {
                    setFormState('')
                    // display error messsage
                    setErrorMessage(response.data.errorMessage)
                    console.log(response.data.errorMessage)
                }
            })
            .catch((error) => {
                console.log(error)
                setFormState('')
                // display error messsage
                setErrorMessage(t('FailedToSubmitToServer'))
            })
    })

    // use handleSubmitClick to enable submit
    function handleSubmitClick(e: any) {
        console.log(
            `handleSubmitClick().. isModified=${e.isModified} isValid=${e.isValid
            } values=${JSON.stringify(e.values)}`
        ) // + JSON.stringify(e.values);
        if (!e.isValid) return
    }

    const CalculateCoordinateRow = (fieldRenderProps: FieldRenderProps) => {
        const { label, value, onChange } = fieldRenderProps
        return (
            <div className='k-form-field d-flex flex-row justify-content-end'>
                <Button look='flat'>Find Coordinate..</Button>
            </div>
        )
    }

    function onMapCreated(newMap: Map) {
        console.log('onMapCreated()')
        newMap.on('editable:drawing:end', onEditableDrawingEnd)
        newMap.on('editable:created', onEditableCreated)
        newMap.on('editable:vertex:dragend', onEditableVertexDragEnd)
        newMap.on('editable:drawing:commit', onEditableDrawingCommit)
        setMap(newMap)
    }

    function drawMarker() {
        console.log('drawMarker() --', locationLat, locationLon) 
        if (map === null) {
            console.log('map is null')
            return
        }
        let marker = locationMarker
        if (
            locationLat !== null &&
            locationLon !== null &&
            isLatLonValid(locationLat, locationLon)
        ) {
            console.log('LatLng valid..')
            const latLng = L.latLng(locationLat, locationLon)
            if (marker === null) {
                const icon = L.icon({
                    iconUrl: 'media/icons/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                })

                marker = L.marker(latLng, {
                    icon: icon,
                    draggable: true,
                    autoPan: true,
                })
                marker.on('dragend', onMarkerDragged)
                //marker.on('dragend', (e) => { console.log('marker.dragend. geofence=', geofence) }, marker)
                //marker.on('dragend', markerDraggedHandler)
                map.addLayer(marker)
                map.setView(latLng, 15)
            } else {
                marker.setLatLng(latLng)
            }
        }
        else {
            console.log('LatLng not valid..')
            if (marker !== null) {
                map.removeLayer(marker)
                marker = null
            }
        }
        setLocationMarker(marker)
    }

    function drawGeofence() {
        console.log('drawGeofence()')
        if (map === null) {
            console.log('map is null')
            return
        }
        console.log('drawGeofence - geofenceType:', geofenceType)
        var layer = editableLayer.current
        if (geofenceType === GeofenceType.CIRCLE) {
            if (layer !== null) {
                map?.removeLayer(layer)
            }
            if (
                locationLat !== null &&
                locationLon !== null &&
                isLatLonValid(locationLat, locationLon) &&
                geofenceRadius !== null &&
                geofenceRadius > 0.0
            ) {
                var circle = L.circle(L.latLng(locationLat, locationLon), { radius: geofenceRadius })
                map?.addLayer(circle)
                circle.enableEdit()
                editableLayer.current = circle
            }
        } else if (geofenceType == GeofenceType.RECTANGLE) {
            //console.log('rectanglePoints:', rectanglePoints)
            if (layer !== null && layer !== rectangleGeofence.current) {
                map?.removeLayer(layer)
            }
            if (rectangleGeofence.current !== null) {
                map?.addLayer(rectangleGeofence.current)
                rectangleGeofence.current.enableEdit()
                editableLayer.current = rectangleGeofence.current
            }
        }
        else if (geofenceType == GeofenceType.POLYGON) {
            if (layer !== null && layer !== polygonGeofence.current) {
                map?.removeLayer(layer)
            }
            if (polygonGeofence.current !== null) {
                map?.addLayer(polygonGeofence.current)
                polygonGeofence.current.enableEdit()
                editableLayer.current = polygonGeofence.current
            }
        }
        //setGeofenceLayer(layer)
        //return layer
    }

    function zoomToLocation() {
        console.log('zoomToLocation()...')
        const lon = getValues('lon')
        const lat = getValues('lat')
        if (isLatLonValid(lat, lon) && map) {
            map.setView(L.latLng(lat, lon), 15)
        }
    }

    function onMarkerDragged(e: L.DragEndEvent) {
        console.log('onMarkerDragged()', e)
        const latLng = e.target.getLatLng()
        setValue('lon', latLng.lng, { shouldDirty: true })
        setValue('lat', latLng.lat, { shouldDirty: true })
        setLocationLat(latLng.lat)
        setLocationLon(latLng.lng)
    }

    function onFindCoordinateClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (!geocoder) return
        let address = getValues('address')
        console.log('Finding address: ' + address)
        geocoder.geocode({ address: address }, function (results, status) {
            if (status == 'OK' && results != null) {
                console.log('Address found..')
                let location = results[0].geometry.location
                const lat = location.lat()
                const lng = location.lng()
                setValue('lon', lng, { shouldDirty: true })
                setValue('lat', lat, { shouldDirty: true })
                setLocationLat(lat)
                setLocationLon(lng)
                if (map) map.flyTo(L.latLng(lat, lng), 15)
            } else {
                console.log('Geocode was not successful for the following reason: ' + status)
            }
        })
    }

    function onZoomToLocationClick(event: React.MouseEvent<HTMLButtonElement>) {
        zoomToLocation()
    }

    function onGeofenceTypeChange(value: any) {
        console.log('onGeofenceTypeChange: ' + value)
        if (value !== geofenceType) {
            map?.editTools.stopDrawing()
            setGeofenceType(value)
        }
    }

    function onLatChange(e: any) {
        console.log('onLatChange', e)
        //setGeofence({...geofence, lat: e.value})
        setLocationLat(e.value)
        zoomToLocation()
    }

    function onLonChange(e: any) {
        console.log('onLonChange', e)
        //setGeofence({...geofence, lon: e.value})
        setLocationLon(e.value)
        zoomToLocation()
    }

    function onRadiusChange(e: any) {
        console.log('onRadiusChange()', e)
        //let layer = drawGeofence({...geofence, radius: value.value})
        //setGeofence({...geofence, radius: e.value})
        setGeofenceRadius(e.value)
    }

    function onEditableCreated(e: L.LeafletEvent) {
        console.log('onEditableCreated()', e)
    }

    function onEditableDrawingEnd(e: L.LeafletEvent) {
        console.log('onEditableDrawingEnd()', e)
    }

    function onEditableDrawingCommit(e: any) {
        console.log('onEditableDrawingCommit()', e)
        const layer = e.layer
        editableLayer.current = layer
        if (layer instanceof L.Rectangle) {
            console.log('Reactangle created.')
            rectangleGeofence.current = layer
        } else if (layer instanceof L.Polygon) {
            console.log('Polygon created.')
            polygonGeofence.current = layer
        } else {
            console.log('Unknown shape created', layer)
        }
    }

    function onEditableVertexDragEnd(e: any) {
        console.log('onEditableVertexDragEnd()', e)
        if (e.layer instanceof L.Circle) {
            var circle = e.layer as L.Circle
            var r = Math.round(circle.getRadius())
            console.log('-- radius = ' + r)
            setValue('radius', r, { shouldDirty: true })
            setGeofenceRadius(r)
        }
        else if (e.layer instanceof L.Rectangle) {
        }
        else if (e.layaer instanceof L.Polygon) {
        }
    }

    function onCreateGeofenceClick() {
        console.log('onCreateGeofenceClick()')
        if (map) {
            map.editTools.stopDrawing()
            if (editableLayer.current !== null) {
                map.removeLayer(editableLayer.current)
                editableLayer.current = null
            }
            if (geofenceType === GeofenceType.RECTANGLE) map.editTools.startRectangle()
            else if (geofenceType === GeofenceType.POLYGON) map.editTools.startPolygon()
        }
    }

    function isLatLonValid(lat: number | null, lon: number | null) {
        return (
            lon !== null &&
            lat !== null &&
            lon >= -180.0 &&
            lon < 180.0 &&
            lat > -90.0 &&
            lat < 90.0
        )
    }

    console.log('LocationForm.render() geofenceType=', geofenceType)

    return (
        <Dialog title={title} onClose={onClose} width={1200} height={600}>
            <div className='w-100 h-100 d-flex flex-row gap-8'>
                {/* form part */}
                <div className='w-400px h-100'>
                    <form id='myForm' onSubmit={onSubmit}>
                        <div className='k-form k-form-horizontal'>
                            {errorMessage && (
                                <div className={'k-messagebox k-messagebox-error'}>
                                    {errorMessage}
                                </div>
                            )}
                            <HookFormInput
                                name='location_name'
                                control={control}
                                //defaultValue={formData.location_name}
                                label={t('LocationName')}
                                rules={{ required: t('DataIsRequired', { data: t('LocationName') }) }}
                            />
                            <HookFormInput
                                name='location_code'
                                control={control}
                                //defaultValue={formData.location_code}
                                label={t('LocationCode')}
                            />
                            <HookFormComboBoxWithRemoteData
                                name='location_type_id'
                                control={control}
                                //defaultValue={formData.location_type_id}
                                label={t('LocationType')}
                                dataUrl='api/locationType/list'
                            />
                            <HookFormTextArea
                                name='address'
                                control={control}
                                //defaultValue={formData.address}
                                label={t('Address')}
                                rows={4}
                            />
                            <div className='k-form-field d-flex flex-row justify-content-end'>
                                <Button type='button' look='flat' onClick={onFindCoordinateClick}>
                                    {t('FindCoordinate')}
                                </Button>
                                <Button
                                    type='button'
                                    look='flat'
                                    onClick={onZoomToLocationClick}
                                    className='ms-2'
                                >
                                    {t('ZoomToLocation')}
                                </Button>
                            </div>
                            <HookFormNumericTextBox
                                name='lon'
                                control={control}
                                //defaultValue={formData.lon}
                                label={t('Longitude')}
                                step={0.000001}
                                format='n6'
                                onChange={onLonChange}
                            />
                            <HookFormNumericTextBox
                                name='lat'
                                control={control}
                                //defaultValue={formData.lat}
                                label={t('Latitude')}
                                step={0.000001}
                                format='n6'
                                onChange={onLatChange}
                            />
                            <HookFormDropDownList
                                name='geofence_type'
                                control={control}
                                //defaultValue={formData.geofence_type}
                                label={t('GeofenceType')}
                                data={geofenceShapes}
                                onChange={onGeofenceTypeChange}
                            />
                            {geofenceType === 'CIRCLE' && (
                                <HookFormNumericTextBox
                                    name='radius'
                                    control={control}
                                    //defaultValue={formData.radius}
                                    label={t('Radius') + ' (m)'}
                                    step={1}
                                    onChange={onRadiusChange}
                                />
                            )}
                            {geofenceType !== 'CIRCLE' && (
                                <div className='k-form-field d-flex flex-row justify-content-end'>
                                    <Button
                                        type='button'
                                        look='flat'
                                        onClick={onCreateGeofenceClick}
                                    >
                                        {t('CreateData', { data: 'Geofence' })}
                                    </Button>
                                    {/* <Button
                                        type='button'
                                        look='flat'
                                        onClick={onEditGeofenceClick}
                                        className='ms-2'
                                    >
                                        {t('EditData', { data: 'Geofence' })}
                                    </Button> */}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
                {/* map part */}
                <div className='h-100 flex-grow-1'>
                    <MapContainer
                        bounds={initialBounds}
                        // center={position}
                        // zoom={13}
                        scrollWheelZoom={true}
                        className='h-100 w-100'
                        whenCreated={onMapCreated}
                        attributionControl={false}
                        editable={true}
                    >
                        <ReactLeafletGoogleLayer
                            apiKey={GOOGLE_API_KEY}
                            type={'roadmap'}
                            useGoogMapsLoader={false}
                        />
                        {/* <TileLayer
                            //attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        /> */}
                        {/* {coordinateIsValid && (
                            <DraggableMarker
                                position={locationCoord}
                                icon={icon}
                                draggable={true}
                                onDragged={onMarkerDragged}
                            />
                        )} */}
                        {/* <Marker position={position}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker> */}
                    </MapContainer>
                </div>
            </div>
            <DialogActionsBar layout={'end'}>
                {formState !== 'error' && (
                    <Button
                        primary={true}
                        type={'submit'}
                        form={'myForm'}
                        style={{ minWidth: 100 }}
                        disabled={formState !== ''}
                    >
                        OK
                        {/*{formState === 'submitting' ? `${t('Saving')}...` : 'OK'}*/}
                    </Button>
                )}
                <Button onClick={onClose} style={{ minWidth: 80 }}>
                    {t('Cancel')}
                </Button>
            </DialogActionsBar>
        </Dialog>
    )
}

export default LocationForm
