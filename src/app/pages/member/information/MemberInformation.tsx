import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { RootState } from "../../../../setup";
import { Member } from "../../../interfaces/Member";
import { HookFormInput } from "../../../shared/components/ReactHookForm/HookFormInput";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { HookFormTextArea } from "../../../shared/components/ReactHookForm/HookFormTextArea";
import { Button } from "@progress/kendo-react-buttons";
import { HookFormNumericTextBox } from "../../../shared/components/ReactHookForm/HookFormNumericTextBox";
import { HookFormCheckbox } from "../../../shared/components/ReactHookForm/HookFormCheckbox";
import { HookFormSwitch } from "../../../shared/components/ReactHookForm/HookFormSwitch";
import { HookFormDatePicker } from "../../../shared/components/ReactHookForm/HookFormDatePicker";
import { HookFormComboBoxWithRemoteData } from "../../../shared/components/ReactHookForm/HookFormComboBoxRemoteData";
import axios from "axios";
import toast from "react-hot-toast";
import { dataLoaded } from "../MemberSlice";
import { MyFormState } from "../../../classes/MyFormState";

export function MemberInformation() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const memberState = useSelector((state: RootState) => state.member);
    const params: { id: string } = useParams();
    const history = useHistory();
    const initialFormData: Member = {
        member_id: 0,
        member_name: '',
        member_code: '',
        account_no: '',
        registration_date: null,
        suspension_date: null,
        member_status_id: 2,
        member_status_desc: '',
        num_of_vehicles: 0,
        payment_warning: false,
        address: '',
        zip_code: '',
        phone: '',
        sales_person_id: null,
        xero_contact_id: null,
        due_date_days: 21,
        grace_period_length: 5,
        auto_suspension: true,
        display_payment_warning: true,
        min_suspension_date: new Date(),
        apply_biaya_materai: true,
        va_bca: '',
        va_mandiri: '',
        apply_tax: true,
        faktur_pajak: true,
        nama_pajak: '',
        alamat_pajak: '',
        npwp: '',
        npkp: '',
        contact_person: '',
        mobile_phone: '',
        email: '',
        server_charge: 0,
        notes: '',
        should_be_suspended: false
    }
    const [formState, setFormState] = useState<MyFormState>('')
    const [errorMessage, setErrorMessage] = useState('')

    const validationSchema = Yup.object().shape({
        member_name: Yup.string()
            .required(t('DataIsRequired', { data: t('MemberName') }))
            .min(4, t('DataMustBeAtLeastNCharacters', { data: t('MemberName'), n: 4 })),
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
    } = useForm<Member>({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (memberState.state === 'loaded') {
            reset(memberState.data!)
            setFormState('view')
        }
        else if (memberState.state === 'new') {
            reset(initialFormData);
            setFormState('editing')
        }
        //loadData()
    }, [memberState])

    function loadData() {
        console.log('loadData().. dataId = ' + params.id)
        setFormState('loading')
        let url = `api/member/${params.id}`
        axios
            .get(url)
            .then((response) => {
                const data = response.data
                console.log('Data loaded. ', data)
                reset(data)
                setFormState('view')
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(t('FailedToLoadData'))
                setFormState('error')
            })
    }

    function onEditClicked() {
        setFormState('editing')
    }

    function onCancelClicked() {
        if (memberState.state === 'new') {
            // back to member page
            history.push('/member')
        }
        else {
            // resetForm
            reset(memberState.data!)
            setFormState('view')
        }
    }

    function doUpdate(data: Member) {
        let url = 'api/member/update'
        data.member_id = parseInt(params.id);
        axios
            .post(url, data)
            .then((response) => {
                console.log('Response.data', response.data)
                if (response.data.success) {
                    dispatch(dataLoaded(response.data.result))
                    reset(response.data.result)
                    setFormState('view')
                    //if (onSuccess) onSuccess(data, response.data.result)
                    let message = t('DataHasBeenUpdated', { data: data.member_name })
                    toast.success(message)
                } else {
                    setFormState('')
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

    function doRegister(data: Member) {
        let url = 'api/member/register'
        data.member_id = 0
        axios
            .post(url, data)
            .then((response) => {
                console.log('Response.data', response.data)
                if (response.data.success) {
                    history.push('/member/' + response.data.result.member_id)
                    //let message = t('DataHasBeenUpdated', { data: data.member_name })
                    //toast.success(message)
                } else {
                    setFormState('')
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
        if (memberState.state === 'new')
            doRegister(data)
        else
            doUpdate(data)
    })

    let isDisabled = formState !== 'editing'

    return (
        <div className='w-100 h-100 d-flex flex-column'>
            {/* toolbar */}
            <div className='container-fluid h-60px d-flex flex-row align-items-center gap-2 flex-shrink-0 bg-white' style={{ borderBottomStyle: 'solid', borderBottomColor: '#eff2f5', borderBottomWidth: '1px' }}>
                {formState === 'view' && (
                    <>
                        <Button primary={true} togglable={false} className='w-80px' onClick={onEditClicked}>
                            {t('Edit')}
                        </Button>
                        <div className="vr ms-1" style={{ height: '40px'}}></div>
                        {/* <div className='w-50px' /> */}
                        {(memberState.data?.member_status_id === 1 || memberState.data?.member_status_id === 4) && (
                            <Button primary={true} togglable={false} className='ms-1'>
                                {t('Activate')}
                            </Button>
                        )}
                        {(memberState.data?.member_status_id === 2 || memberState.data?.member_status_id == 3) && memberState.data?.should_be_suspended === true && (
                            <Button primary={false} togglable={false} className='ms-1'>
                                {t('PostponeSuspension')}
                            </Button>
                        )}
                        {(memberState.data?.member_status_id === 2) && (
                            <Button primary={false} togglable={false} className='ms-1'>
                                {t('Suspend')}
                            </Button>
                        )}
                        {(memberState.data?.member_status_id === 1 || memberState.data?.member_status_id === 2 || memberState.data?.member_status_id === 3) && (
                            <Button primary={false} togglable={false} className='ms-1'>
                                {t('Deactivate')}
                            </Button>
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
                    <div className='k-form k-form-horizontal w-600px'>
                        <fieldset className="k-form-fieldset">
                            <legend className='k-form-legend'>{t('MemberInformation')}</legend>
                            <HookFormInput
                                name='member_name'
                                control={control}
                                label={t('MemberName')}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='member_code'
                                control={control}
                                label={t('MemberCode')}
                                disabled={isDisabled}
                            />
                            <HookFormTextArea
                                name='address'
                                control={control}
                                label={t('Address')}
                                rows={4}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='zip_code'
                                control={control}
                                label={t('ZipCode')}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='phone'
                                control={control}
                                label={t('Phone')}
                                disabled={isDisabled}
                            />
                        </fieldset>
                        <fieldset className="k-form-fieldset">
                            <legend className='k-form-legend'>{t('Contact')}</legend>
                            <HookFormInput
                                name='contact_person'
                                control={control}
                                label={t('ContactPerson')}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='mobile_phone'
                                control={control}
                                label={t('MobilePhone')}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='email'
                                control={control}
                                label={t('Email')}
                                disabled={isDisabled}
                            />
                        </fieldset>
                        <fieldset className="k-form-fieldset">
                            <legend className='k-form-legend'>{t('Sales')}</legend>
                            <HookFormComboBoxWithRemoteData
                                name='sales_person_id'
                                control={control}
                                label={t('SalesPerson')}
                                dataUrl='api/employee/list'
                                disabled={isDisabled}
                            />
                        </fieldset>
                        <fieldset className="k-form-fieldset">
                            <legend className='k-form-legend'>{t('Billing')}</legend>
                            <HookFormComboBoxWithRemoteData
                                name='xero_contact_id'
                                control={control}
                                label='Xero Contact Name'
                                dataUrl='api/data/XeroContactList'
                                disabled={isDisabled}
                            />
                            <HookFormNumericTextBox
                                name='due_date_days'
                                control={control}
                                label={t('DueDate')}
                                disabled={isDisabled}
                                componentWidth='150px'
                                postfix={t('Days')}
                            />
                            <HookFormNumericTextBox
                                name='grace_period_length'
                                control={control}
                                label={t('GracePeriod')}
                                disabled={isDisabled}
                                componentWidth='150px'
                                postfix={t('Days')}
                            />
                            <HookFormCheckbox
                                name='auto_suspension'
                                control={control}
                                label={t('AutoSuspension')}
                                disabled={isDisabled}
                            //postfix={t('AutoSuspension')}
                            />
                            <HookFormCheckbox
                                name='display_payment_warning'
                                control={control}
                                label={t('DisplayWarning')}
                                disabled={isDisabled}
                            //postfix={t('Yes')}
                            />
                            {/*<HookFormDatePicker*/}
                            {/*    name='min_suspension_date'*/}
                            {/*    control={control}*/}
                            {/*    label={t('MinSuspensionDate')}*/}
                            {/*    disabled={isDisabled}*/}
                            {/*    format={'dd-MM-yyyy'}*/}
                            {/*    defaultValue={new Date()}*/}
                            {/*//postfix={t('Yes')}*/}
                            {/*/>*/}
                            <HookFormCheckbox
                                name='apply_biaya_materai'
                                control={control}
                                label={t('StampCost')}
                                disabled={isDisabled}
                            //postfix={t('Yes')}
                            />
                            <HookFormInput
                                name='va_mandiri'
                                control={control}
                                label='No VA Mandiri'
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='va_bca'
                                control={control}
                                label='No VA BCA'
                                disabled={isDisabled}
                            />
                        </fieldset>
                        <fieldset className="k-form-fieldset">
                            <legend className='k-form-legend'>{t('Tax')}</legend>
                            <HookFormCheckbox
                                name='apply_tax'
                                control={control}
                                label={t('ApplyTax')}
                                disabled={isDisabled}
                            //postfix={t('Yes')}
                            />
                            <HookFormCheckbox
                                name='faktur_pajak'
                                control={control}
                                label={t('PrintFakturPajak')}
                                disabled={isDisabled}
                            //postfix={t('Yes')}
                            />
                            <HookFormInput
                                name='nama_pajak'
                                control={control}
                                label={t('TaxName')}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='alamat_pajak'
                                control={control}
                                label={t('TaxAddress')}
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='npwp'
                                control={control}
                                label='NPWP'
                                disabled={isDisabled}
                            />
                            <HookFormInput
                                name='nppkp'
                                control={control}
                                label='NPPKP'
                                disabled={isDisabled}
                            />

                        </fieldset>
                    </div>
                </form>
            </div>
        </div>
    )
}