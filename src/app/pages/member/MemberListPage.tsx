import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../../hooks'

import { Grid, GridCellProps, GridColumn, GridDataStateChangeEvent } from '@progress/kendo-react-grid'
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
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { DataResult, State, toDataSourceRequestString } from '@progress/kendo-data-query'
// import {SubHeader} from '../../layout/components/subheader/SubHeader'
// import {ContentContainer} from '../../layout/components/ContentContainer'
// import SearchTextBox from '../../shared/components/SearchTextBox'
import { openDialog, closeDialog } from '../../shared/components/AppDialog/AppDialogSlice'
// import {addNotification} from '../../shared/helpers/notification'
import { gridStateChanged, gridPageChanged, loadGridData } from './MemberSlice'
import { LoadParameter } from './MemberSlice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash } from '@fortawesome/pro-regular-svg-icons'

import { PageTitle } from '../../../_metronic/layout/core'
import { ContentContainer } from '../../layout/components/ContentContainer'
import { SearchTextBox } from '../../shared/components/SearchTextBox/SearchTextBox'
// import { CustomerLoader } from './CustomerLoader'
// import CustomerForm from './CustomerForm'
// import { Customer } from '../../interfaces/Customer'
import { Toolbar } from '../../layout/components/Toolbar'
import { PageContainer } from '../../layout/components/PageContainer'
import { ShowDeleteConfirmation } from '../../shared/components/AppDialog/AppDialog'
import toast from 'react-hot-toast'
import { Member } from '../../interfaces/Member'
import { MemberLoader } from './MemberLoader'
import { ComboBoxWithRemoteData } from '../../shared/components/Dropdowns/ComboBoxWithRemoteData'
import { Link, useHistory } from 'react-router-dom'
import { MemberStatusPill } from '../../shared/components/MemberStatusPill'
import { DropDownListWithRemoteData } from '../../shared/components/Dropdowns/DropDownListWithRemoteData'

library.add(faEdit, faTrash)

export function MemberListPage() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const history = useHistory();
    const [gridHeight, setGridHeight] = useState(0)
    const [memberStatus, setMemberStatus] = useState<string|null>('')
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
        title: 'Add Member',
        dataId: '',
    }

    const initialDialogState = {}

    const [editState, setEditState] = useState(initialEditState)

    // this effect to set grid height to match the container height
    useEffect(() => {
        const height = document.getElementById('gridContainer')?.clientHeight
        if (height) {
            setGridHeight(height - 1)
        }
    }, [])

    function onFilterStatusChange(value: string|null) {
        setMemberStatus(value)
    }

    function onSearchTextChange(value: string) {
        setSearchText(value)
    }

    function onGridStateChange(e: GridDataStateChangeEvent) {
        setDataState(e.dataState)
    }

    function dataReceived(items: DataResult) {
        if (items.total > dataState.skip!) setItems(items)
        else {
            // calculate page
            let page = Math.floor(items.total / dataState.take!)
            console.log('Change page to ' + page)
            setDataState({ ...dataState, skip: (page - 1) * dataState.take! })
            setDataVersion(dataVersion + 1)
        }
    }

    function reloadGrid() {
        setDataVersion(dataVersion + 1)
    }

    function registerMember() {
        history.push('/member/register')
    }

    function handleFormClose() {
        setEditState({ ...editState, visible: false })
    }

    function handleFormSuccess(data: Member) {
        setEditState({ ...editState, visible: false })
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', { data: data.member_name })
        } else {
            message = t('DataHasBeenUpdated', { data: data.member_name })
        }
        toast.success(message)
    }

    function hadleEditButtonClick(data: any) {
        history.push(`member/${data.member_id}`)
    }

    function hadleDeleteButtonClick(data: Member) {
        ShowDeleteConfirmation(dispatch, t, t('Member'), data.member_name, () => {
            handleDeleteConfirm(data)
        })
    }

    function handleDeleteConfirm(data: Member) {
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', { data: data.member_name })
        let successMsg = t('DataHasBeenDeleted', { data: data.member_name })
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }

    function submitDeletePromise(data: Member) {
        let url = `api/Customer/delete/${data.member_id}`
        // use delay to show deleting animation..
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }

    const toolbar = (
        <Button primary={true} onClick={registerMember} togglable={false}>
            {t('Register')} {t('Member')}
        </Button>
    )

    const memberNameCell = (props: GridCellProps) => {
        let url = '/member/' + props.dataItem.member_id;
        return (
            <td width='250px'>
                <Link to={url}>{props.dataItem.member_name}</Link>
            </td>
        //    <td width='250px'>
        //        <div className='d-flex align-items-center gap-2'>
        //            <Link to={url}>{props.dataItem.member_name}</Link>
        //            <MemberStatusPill status={props.dataItem.member_status_id} />
        //        </div>
        //    </td>
        )
    }

    const memberCodeCell = (props: GridCellProps) => {
        let url = '/member/' + props.dataItem.member_id;
        return (
            <td width='200px'><Link to={url}>{props.dataItem.member_code}</Link></td>
        )
    }

    const memberStatusCell = (props: GridCellProps) => {
        //let url =  props.dataItem.member_status_id;
        return (
            <td width='150px' className='text-center'><MemberStatusPill status={props.dataItem.member_status_id} /></td>
        )
    }

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
                    {/* <span
                        className='cursor-pointer'
                        onClick={() => hadleDeleteButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'trash']} />
                    </span> */}
                </div>
            </td>
        )
    }

    return (
        <PageContainer>
            <PageTitle breadcrumbs={[]}>{t('Member')}</PageTitle>
            <Toolbar toolbar={toolbar}></Toolbar>
            <ContentContainer>
                <div className='d-flex align-items-center flex-wrap justify-content-between mt-2 mb-2 w-100'>
                    {/* <!-- left aligned controllers --> */}
                    <div className='d-flex align-items-center mb-3'>
                        <div className=''>
                            <span>{t('Status')}</span>
                        </div>
                        <div className='ms-4'>
                            <DropDownListWithRemoteData onChange={onFilterStatusChange} dataUrl='/api/data/memberStatusList' addAllAsDefault={true} value={memberStatus} className='w-200px' />
                        </div>
                    </div>
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
                            style={{ height: `${gridHeight}px` }}
                        >
                            <GridColumn field='member_name' title={t('MemberName')} cell={memberNameCell} width='350px'  />
                            <GridColumn field='member_code' title={t('MemberCode')} cell={memberCodeCell} width='150px' />
                            <GridColumn field='account_no' title={t('AccountNumber')} width='150px' />
                            <GridColumn field='num_of_vehicles' title={t('NumOfVehicles')} width='150px' className='text-center' headerClassName='text-center' />
                            <GridColumn field='member_status_desc' title={t('Status')} width='150px' cell={memberStatusCell} className='text-center' headerClassName='text-center' />
                            <GridColumn field='registration_date' title={t('RegistrationDate')}  format="{0:yyyy-MM-dd}" />
                            <GridColumn
                                field='member_id'
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
                    <MemberLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        memberStatus={memberStatus}
                        searchText={searchText}
                        version={dataVersion}
                    />
                </div>
                {/* {editState.visible && (
                    <CustomerForm
                        title={editState.title}
                        mode={editState.mode}
                        dataId={editState.dataId}
                        onClose={handleFormClose}
                        onSuccess={handleFormSuccess}
                    />
                )} */}
            </ContentContainer>
        </PageContainer>
    )
}
