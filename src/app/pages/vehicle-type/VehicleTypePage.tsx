import React, {useEffect, useState, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import axios from 'axios'

import {Grid, GridCellProps, GridColumn, GridDataStateChangeEvent} from '@progress/kendo-react-grid'
import {
    Button,
    ButtonGroup,
    DropDownButton,
    DropDownButtonItem,
    FloatingActionButton,
    SplitButton,
    SplitButtonItem,
    Chip,
    ChipList,
    ToolbarItem,
} from '@progress/kendo-react-buttons'
import {DataResult, State, toDataSourceRequestString} from '@progress/kendo-data-query'
import {openDialog, closeDialog} from '../../shared/components/AppDialog/AppDialogSlice'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faEdit, faTrash} from '@fortawesome/pro-regular-svg-icons'

import {PageTitle} from '../../../_metronic/layout/core'
import {ContentContainer} from '../../layout/components/ContentContainer'
import {SearchTextBox} from '../../shared/components/SearchTextBox/SearchTextBox'
import { VehicleTypeLoader } from './VehicleTypeLoader'
import VehicleTypeForm from './VehicleTypeForm'
import {Toolbar} from '../../layout/components/Toolbar'
import {PageContainer} from '../../layout/components/PageContainer'
import {ShowDeleteConfirmation} from '../../shared/components/AppDialog/AppDialog'
import toast from 'react-hot-toast'

library.add(faEdit, faTrash)

export function VehicleTypePage() {
    const {t} = useTranslation('translation')
    const dispatch = useDispatch()
    const [gridHeight, setGridHeight] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [dataVersion, setDataVersion] = useState(0)

    const [items, setItems] = React.useState<DataResult>({
        data: [],
        total: 0,
    })
    const [dataState, setDataState] = React.useState<State>({
        take: 20,
        skip: 0,
    })

    const initialEditState = {
        visible: false,
        mode: '',
        title: 'Add Vehicle Type',
        dataId: '',
    }

    const initialDialogState = {}

    const [editState, setEditState] = useState(initialEditState)

    useEffect(() => {
        const height = document.getElementById('gridContainer')?.clientHeight
        if (height) {
            setGridHeight(height - 1)
        }
    }, [])

    function onSearchTextChange(value: string) {
        setSearchText(value)
    }

    function onGridStateChange(e: GridDataStateChangeEvent) {
        setDataState(e.dataState)
    }

    function dataReceived(items: DataResult) {
        if (items.total > dataState.skip!) setItems(items)
        else {
            let page = Math.floor(items.total / dataState.take!)
            console.log('Change page to ' + page)
            setDataState({...dataState, skip: (page - 1) * dataState.take!})
            setDataVersion(dataVersion + 1)
        }
    }

    function reloadGrid() {
        setDataVersion(dataVersion + 1)
    }

    function addData() {
        setEditState({
            visible: true,
            mode: 'add',
            title: t('Add') + ' ' + t('VehicleType'),
            dataId: '',
        })
    }

    function handleFormClose() {
        setEditState({...editState, visible: false})
    }

    function handleFormSuccess(data: any) {
        setEditState({...editState, visible: false})
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', { data: data.VehicleTypeCode })
        } else {
            message = t('DataHasBeenUpdated', { data: data.VehicleTypeCode})
        }
        toast.success(message)
    }

    function hadleEditButtonClick(data: any) {
        setEditState({
            visible: true,
            mode: 'edit',
            title: t('Edit') + ' ' + t('VehicleType'),
            dataId: data.vehicle_type_id,
        })
    }

    function hadleDeleteButtonClick(data: any) {
        ShowDeleteConfirmation(dispatch, t, t('VehicleType'), data.vehicle_type_code, () => {
            handleDeleteConfirm(data)
        })
    }

    function handleDeleteConfirm(data: any) {
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', { data: data.vehicle_type_code})
        let successMsg = t('DataHasBeenDeleted', { data: data.vehicle_type_code})
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }

    function submitDeletePromise(data: any) {
        let url = `api/VehicleType/delete/${data.vehicle_type_id}`
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }

    const toolbar = (
        <Button primary={true} onClick={addData} togglable={false}>
            {t('Add')} {t('VehicleType')}
        </Button>
    )

    const actionCell = (props: GridCellProps) => {
        return (
            <td>
                <div className='d-flex flex-row flex-1 align-items-center justify-content-center gap-2'>
                    <span
                        className='cursor-pointer'
                        onClick={() => hadleEditButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'edit']} />
                    </span>
                    <span
                        className='cursor-pointer'
                        onClick={() => hadleDeleteButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'trash']} />
                    </span>
                </div>
            </td>
        )
    }

    return (
        <PageContainer>
            <PageTitle breadcrumbs={[]}>{t('VehicleType')}</PageTitle>
            <Toolbar toolbar={toolbar}></Toolbar>
            <ContentContainer>
                <div className='d-flex align-items-center flex-wrap justify-content-between mt-2 mb-2 w-100'>
                    {/* <!-- right aligned controllers --> */}
                    <div className='d-flex align-items-center mb-3'>
                        <SearchTextBox onChange={onSearchTextChange}></SearchTextBox>
                    </div>
                </div>
                <div id='gridContainer' className='w-100 h-100'>
                    {gridHeight > 0 ? (
                        <Grid
                            filterable={false}
                            sortable={true}
                            pageable={true}
                            scrollable='scrollable'
                            {...dataState}
                            data={items}
                            onDataStateChange={onGridStateChange}
                            style={{height: `${gridHeight}px`}}
                        >
                            <GridColumn field='vehicle_type_code' title={t('Code')} width='150px' />
                            <GridColumn field='vehicle_type_name' title={t('VehicleType')} width='200px' />
                            <GridColumn field='max_load_weight' title={t('MaxCargoWeight')} width='150px' />
                            <GridColumn field='max_load_volume' title={t('MaxCargoVolume')} width='150px' />
                            <GridColumn field='max_load_volume_uom_code' title={t('VolumeUnit')} width='100px' />
                            <GridColumn field='max_passenger' title={t('MaxPassenger')} width='150px' /> 
                            <GridColumn
                                field='vehicle_type_id'
                                title={t('Menu')}
                                width='120px'
                                cell={actionCell}
                                className='text-center'
                                headerClassName='text-center'
                            />
                        </Grid>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    <VehicleTypeLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        searchText={searchText}
                        version={dataVersion}
                    />
                </div>
                {editState.visible && (
                    <VehicleTypeForm
                        title={editState.title}
                        mode={editState.mode}
                        dataId={editState.dataId}
                        onClose={handleFormClose}
                        onSuccess={handleFormSuccess}
                    />
                )}
            </ContentContainer>
        </PageContainer>
    )
}
