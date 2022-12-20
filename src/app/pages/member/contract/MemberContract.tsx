import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from 'yup';
import { RootState } from "../../../../setup";
import { MyFormState } from "../../../classes/MyFormState";
import { Contract } from "../../../interfaces/Contract";
import { ContractAccessory } from "../../../interfaces/ContractAccessory";
import { IdTextTuple } from "../../../interfaces/IdTextTuple";
import { closeDialog, openDialog } from "../../../shared/components/AppDialog/AppDialogSlice";
import { HookFormCheckbox } from "../../../shared/components/ReactHookForm/HookFormCheckbox";
import { HookFormComboBoxWithRemoteData } from "../../../shared/components/ReactHookForm/HookFormComboBoxRemoteData";
import { HookFormDatePicker } from "../../../shared/components/ReactHookForm/HookFormDatePicker";
import { HookFormInput } from "../../../shared/components/ReactHookForm/HookFormInput";
import { HookFormNumericTextBox } from "../../../shared/components/ReactHookForm/HookFormNumericTextBox";
import { HookFormTextArea } from "../../../shared/components/ReactHookForm/HookFormTextArea";
import { ContractAccessoriesGrid } from "./ContractAccesoriesGrid";
import { dataLoaded, dataLoading, loadData, newData } from "./MemberContractSlice";

export function MemberContract() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const history = useHistory();
    const contractState = useSelector((state: RootState) => state.memberContract);
    const params: { id: string, contractId: string } = useParams();
    const [formState, setFormState] = useState<MyFormState>('')
    const [errorMessage, setErrorMessage] = useState('')
    const initialFormData: Contract = {
        contract_id: 0,
        member_id: 0,
        contract_number: '(DRAFT)',
        contract_date: new Date(),
        po_number: '',
        po_date: new Date(),
        sales_person_id: null,
        num_of_vehicles: 1,
        notes: '',
        service_charge: 0,
        rental_charge: 0,
        inactive_service_charge: 0,
        inactive_rental_charge: 0,
        use_customer_gsm_card: false,
        use_voice: false,
        trade_in: false,
        device_contract_type_id: 1,
        accessories: []
    }
    //const [contractAccessories, setContractAccessories] = useState<Array<ContractAccessory>>([]);
    const contractAccessories = useRef<Array<ContractAccessory>>([]);

    function setContractAccessories(value: Array<ContractAccessory>) {
        contractAccessories.current = value
    }

    const validationSchema = Yup.object().shape({
        po_number: Yup.string()
            .required(t('DataIsRequired', { data: t('PONumber') })),
    });

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        control,
        watch,
        getValues,
        formState: { errors },
    } = useForm<Contract>({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (params.contractId.toUpperCase() === 'CREATE') {
            console.log("MemberContract UseEffect() #1 Create")
            dispatch(newData(null))
        //    let data = initialFormData;
        //    // init data
        //    data.contract_number = '(DRAFT)'
        //    data.contract_date = new Date()
        //    data.po_date = new Date()
        //    reset(initialFormData)
        //    setContractAccessories([])
        //    setFormState('editing')
        }
        else {
            dispatch(dataLoading(null))
            dispatch(loadData(params.contractId))
        }
    }, [params])

    useEffect(() => {
        console.log('MemberContract UseEffect() #2 contractState.state = ' + contractState.state)
        if (contractState.state === 'loading') {
            dispatch(
                openDialog({
                    //title: '',
                    style: { minWidth: 300 },
                    children: (
                        <React.Fragment>
                            <p className='p-10'>Loading data...</p>
                        </React.Fragment>
                    ),
                })
            )
        }
        else {
            dispatch(closeDialog(null))
        }
        if (contractState.state === 'loaded') {
            let contract = contractState.data!
            reset(contract)
            //contractAccessories.current = [...contract.accessories]
            setContractAccessories([...contract.accessories])
            setFormState('view')
        }
        else if (contractState.state === 'draft') {
            let data = initialFormData;
            // init data
            data.contract_number = '(DRAFT)'
            data.contract_date = new Date()
            data.po_date = new Date()
            reset(initialFormData)
            setContractAccessories([])
            setFormState('editing')
        }
        //loadData()
    }, [contractState])

    //function loadData() {
    //    console.log('loadData().. dataId = ' + params.id)
    //    setFormState('loading')
    //    let url = `api/member/${params.id}`
    //    axios
    //        .get(url)
    //        .then((response) => {
    //            const data = response.data
    //            console.log('Data loaded. ', data)
    //            reset(data)
    //            setFormState('view')
    //        })
    //        .catch((error) => {
    //            console.log(error)
    //            setErrorMessage(t('FailedToLoadData'))
    //            setFormState('error')
    //        })
    //}

    function onEditClicked() {
        setFormState('editing')
    }

    function onCancelClicked() {
        if (contractState.state === 'draft') {
            // back to member page
            history.push('/member')
        }
        else {
            // resetForm
            reset(contractState.data!)
            setFormState('view')
        }
    }

    function onContractAccessoryChange(data: Array<ContractAccessory>) {
        console.log('onContractAccessoryChange() ', data);
        //contractAccessories.current = [...data]
        setContractAccessories([...data])
    }

    function doUpdate(data: Contract) {
        let url = 'api/contract/update'
        data.member_id = parseInt(params.id);
        data.contract_id = parseInt(params.contractId)
        data.accessories = [...contractAccessories.current]
        //data.accessories = contractAccessories
        axios
            .post(url, data)
            .then((response) => {
                console.log('Response.data', response.data)
                if (response.data.success) {
                    dispatch(dataLoaded(response.data.result))
                    reset(response.data.result)
                    setFormState('view')
                    //if (onSuccess) onSuccess(data, response.data.result)
                    let message = t('DataHasBeenUpdated', { data: data.contract_number })
                    toast.success(message)
                } else {
                    setFormState('')
                    setErrorMessage(response.data.errorMessage)
                    console.log(response.data.errorMessage)
                }
            })
            .catch((error) => {
                console.log(error)
                setFormState('editing')
                setErrorMessage(t('FailedToSubmitToServer'))
            })
    }

    function doRegister(data: Contract) {
        let url = 'api/contract/create'
        data.member_id = parseInt(params.id)
        data.contract_id = 0
        data.accessories = [...contractAccessories.current]
        //data.accessories = contractAccessories
        axios
            .post(url, data)
            .then((response) => {
                console.log('Response.data', response.data)
                if (response.data.success) {
                    const newData = response.data.result
                    dispatch(dataLoaded(newData))
                    reset(newData)
                    setFormState('view')
                    //if (onSuccess) onSuccess(data, response.data.result)
                    let message = t('DataHasBeenCreated', { data: newData.contract_number })
                    toast.success(message)
                } else {
                    setFormState('editing')
                    setErrorMessage(response.data.errorMessage)
                    console.log(response.data.errorMessage)
                }
            })
            .catch((error) => {
                console.log(error)
                setFormState('')
                setErrorMessage(t('FailedToSubmitToServer'))
            })
    }

    const onSubmit = handleSubmit((data) => {
        console.log('onSubmit() data = ', data)
        if (contractState.state === 'draft')
            doRegister(data)
        else
            doUpdate(data)
    })

    let isDraft = contractState.state === 'draft'
    let isDisabled = formState !== 'editing'
    let numOfVehicles = contractState?.data?.num_of_vehicles ?? 0
    let realisation = contractState?.data?.realization ?? 0;
    let availableSlot = numOfVehicles - realisation;
    let generateVehiclesEnabled = formState === 'view' && numOfVehicles > realisation;

    return (
        <div className='w-100 h-100 d-flex flex-column'>
            {/* toolbar */}
            <div className='container-fluid h-60px d-flex flex-row align-items-center gap-2 flex-shrink-0 bg-white' style={{ borderBottomStyle: 'solid', borderBottomColor: '#eff2f5', borderBottomWidth: '1px' }}>
                {isDraft ? (
                    <h2 className='fs-4 my-0 me-8'>(DRAFT)</h2>
                ): (
                    <h2 className='fs-4 my-0 me-8'>{contractState.data?.contract_number}</h2>
                )}
                {formState === 'view' && (
                    <>
                        <Button primary={true} togglable={false} className='w-80px' onClick={onEditClicked}>
                            {t('Edit')}
                        </Button>
                        {/* <div className='w-50px' /> */}
                        {(availableSlot > 0) && (
                            <>
                                <div className="vr ms-1" style={{ height: '40px' }}></div>
                                <Button primary={true} togglable={false} className='ms-1' disabled={!generateVehiclesEnabled}>
                                    Generate Vehicles
                                </Button>
                            </>
                        )}
                    </>
                )}
                {formState === 'editing' && (
                    <>
                        <Button primary={true} type='submit' form='myForm' togglable={false} className='w-80px'>
                            {t('Save')}
                        </Button>
                        <Button primary={false} togglable={false} className='w-80px' onClick={onCancelClicked}>
                            {t('Cancel')}
                        </Button>
                    </>
                )}
            </div>
            <div className='container-fluid pb-10 pt-10 w-100' style={{ height: "calc(100% - 60px)", overflowY: 'auto' }}>
                <form id='myForm' onSubmit={onSubmit}>
                    {/* error message */}
                    <div></div>
                    <div className='d-flex flex-row w-100 gap-10'>
                        <div className='k-form k-form-horizontal w-600px flex-grow-1'>
                            <fieldset className="k-form-fieldset">
                                <legend className='k-form-legend'>{t('General')}</legend>
                                <HookFormInput
                                    name='contract_number'
                                    control={control}
                                    label={t('ContractNumber')}
                                    disabled={true}
                                    showAsLabel={true}
                                />
                                <HookFormDatePicker
                                    name='contract_date'
                                    control={control}
                                    label={t('ContractDate')}
                                    disabled={isDisabled}
                                    format={'dd-MM-yyyy'}
                                    defaultValue={new Date()}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormInput
                                    name='po_number'
                                    control={control}
                                    label={t('PONumber')}
                                    disabled={false}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormDatePicker
                                    name='po_date'
                                    control={control}
                                    label={t('PODate')}
                                    disabled={isDisabled}
                                    format={'dd-MM-yyyy'}
                                    defaultValue={new Date()}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormComboBoxWithRemoteData
                                    name='sales_person_id'
                                    control={control}
                                    label={t('SalesPerson')}
                                    dataUrl='api/employee/list'
                                    disabled={isDisabled}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormComboBoxWithRemoteData
                                    name='device_contract_type_id'
                                    control={control}
                                    label={t('ContractType')}
                                    dataUrl='api/data/deviceContractTypes'
                                    disabled={isDisabled}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormNumericTextBox
                                    name='num_of_vehicles'
                                    control={control}
                                    label={t('NumOfVehicles')}
                                    disabled={isDisabled}
                                    componentWidth='150px'
                                    showAsLabel={isDisabled}
                                />
                                <HookFormCheckbox
                                    name='use_customer_gsm_card'
                                    control={control}
                                    label={t('UseCustomerGsmCard')}
                                    disabled={isDisabled}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormCheckbox
                                    name='use_voice'
                                    control={control}
                                    label={t('EnableVoiceCall')}
                                    disabled={isDisabled}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormInput
                                    name='description'
                                    control={control}
                                    label={t('Description')}
                                    disabled={isDisabled}
                                    showAsLabel={isDisabled}
                                />
                                <HookFormTextArea
                                    name='notes'
                                    control={control}
                                    label={t('Notes')}
                                    rows={4}
                                    disabled={false}
                                    showAsLabel={isDisabled}
                                />
                            </fieldset>
                        </div>
                        <div className='k-form k-form-horizontal w-600px flex-grow-1'>
                            <fieldset className="k-form-fieldset">
                                <legend className='k-form-legend'>{t('Active')}</legend>
                                <HookFormNumericTextBox
                                    name='service_charge'
                                    control={control}
                                    label={t('ServiceCharge')}
                                    disabled={isDisabled}
                                    componentWidth='150px'
                                    showAsLabel={isDisabled}
                                />
                                <HookFormNumericTextBox
                                    name='rental_charge'
                                    control={control}
                                    label={t('RentalCharge')}
                                    disabled={isDisabled}
                                    componentWidth='150px'
                                    showAsLabel={isDisabled}
                                />
                            </fieldset>
                            <fieldset className="k-form-fieldset">
                                <legend className='k-form-legend'>{t('TemporarilyClosed')}</legend>
                                <HookFormNumericTextBox
                                    name='inactive_service_charge'
                                    control={control}
                                    label={t('ServiceCharge')}
                                    disabled={isDisabled}
                                    componentWidth='150px'
                                    showAsLabel={isDisabled}
                                />
                                <HookFormNumericTextBox
                                    name='inactive_rental_charge'
                                    control={control}
                                    label={t('RentalCharge')}
                                    disabled={isDisabled}
                                    componentWidth='150px'
                                    showAsLabel={isDisabled}
                                />
                            </fieldset>
                            <fieldset className="k-form-fieldset">
                                <legend className='k-form-legend'>{t('Accessories')}</legend>
                                <ContractAccessoriesGrid
                                    data={contractAccessories.current}
                                    disabled={isDisabled}
                                    onChange={onContractAccessoryChange} />
                            </fieldset>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}