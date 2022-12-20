import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataResult, State } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridCellProps, GridColumn, GridDataStateChangeEvent } from "@progress/kendo-react-grid";
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { SearchTextBox } from "../../../shared/components/SearchTextBox/SearchTextBox";
import { MemberContractLoader } from "./MemberContractLoader";


export function MemberContractList() {
    const { t } = useTranslation('translation')
    const params: { id: string } = useParams();

    const dispatch = useDispatch()
    const history = useHistory();
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

    function hadleEditButtonClick(data: any) {
        history.push(`member/${data.member_id}`)
    }

    function onCreateContractClick() {
        let url = '/member/' + params.id + '/contract/create';
        history.push(url)
    }

    const contractNumberCell = (props: GridCellProps) => {
        let url = '/member/' + props.dataItem.member_id + '/contract/' + props.dataItem.contract_id;
        return (
            <td width='200px'>
                <Link to={url}>{props.dataItem.contract_number}</Link>
            </td>
        )
    }

    const poNumberCell = (props: GridCellProps) => {
        let url = '/member/' + props.dataItem.member_id + '/contract/' + props.dataItem.contract_id;
        return (
            <td width='200px'><Link to={url}>{props.dataItem.po_number}</Link></td>
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
        <div className='h-100 content'>
            <div className='container-fluid w-100 h-100 d-flex flex-column'>
                <div className='d-flex align-items-center flex-wrap justify-content-between w-100'>
                    {/* <!-- left aligned controllers --> */}
                    <div className='d-flex align-items-center mb-3 gap-2'>
                        {/*<div className="vr ms-2 me-2" style={{ height: '40px' }}></div>*/}
                        <SearchTextBox onChange={onSearchTextChange}></SearchTextBox>
                        {/*    <div className=''>*/}
                        {/*        <span>{t('Status')}</span>*/}
                        {/*    </div>*/}
                        {/*    <div className='ms-4'>*/}
                        {/*        <DropDownListWithRemoteData onChange={onFilterStatusChange} dataUrl='/api/data/memberStatusList' addAllAsDefault={true} value={memberStatus} className='w-200px' />*/}
                        {/*    </div>*/}
                    </div>
                    {/* <!-- right aligned controllers --> */}
                    <div className='d-flex align-items-center mb-3'>
                        <Button primary={true} togglable={false} onClick={onCreateContractClick}>
                            {t('CreateData', { data: t('Contract') })}
                        </Button>
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
                            <GridColumn field='contract_number' title={t('ContractNumber')} cell={contractNumberCell} width='150px' />
                            <GridColumn field='po_number' title={t('PONumber')} cell={poNumberCell} width='180px' />
                            <GridColumn field='po_date' title={t('PODate')} width='120px' format="{0:yyyy-MM-dd}" />
                            <GridColumn field='device_contract_type_desc' title={t('ContractType')} width='120px' className='text-center' headerClassName='text-center' />
                            <GridColumn title={t('Active')} headerClassName='text-center' >
                                <GridColumn field='service_charge' title={t('Service')} width='100px' format="{0:#,##0}" className='text-center' headerClassName='text-center' />
                                <GridColumn field='rental_charge' title={t('Rental')} width='100px' format="{0:#,##0}" className='text-center' headerClassName='text-center' />
                            </GridColumn>
                            <GridColumn title={t('TemporarilyClosed')} headerClassName='text-center' >
                                <GridColumn field='inactive_service_charge' title={t('Service')} width='100px' format="{0:#,##0}" className='text-center' headerClassName='text-center' />
                                <GridColumn field='inactive_rental_charge' title={t('Rental')} width='100px' format="{0:#,##0}" className='text-center' headerClassName='text-center' />
                            </GridColumn>
                            <GridColumn field='num_of_vehicles' title={t('NumOfVehicles')} className='text-center' headerClassName='text-center' />
                            <GridColumn field='realization_gap' title={t('AvailableSlots')} className='text-center' headerClassName='text-center' />
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
                    <MemberContractLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        memberId={params.id}
                        searchText={searchText}
                        version={dataVersion}
                    />
                </div>
            </div>
        </div>
    )
}