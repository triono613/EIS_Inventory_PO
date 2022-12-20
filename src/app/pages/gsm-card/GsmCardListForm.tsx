import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form'
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
    Toolbar,
    ToolbarItem,
} from '@progress/kendo-react-buttons'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs'

import { FormInput, FormDropDownList, FormComboBox } from '../../shared/components/form-components'
import { requiredValidator, emailValidator } from '../../shared/components/validators'
import { requestPassword } from '../../modules/auth/redux/AuthCRUD'
import { faBullseyeArrow } from '@fortawesome/pro-regular-svg-icons'
import { DropDownListWithRemoteData } from '../../shared/components/Dropdowns/DropDownListWithRemoteData'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { HookFormInput } from '../../shared/components/ReactHookForm/HookFormInput'
import { HookFormDropDownList } from '../../shared/components/ReactHookForm/HookFormDropDownList'
import { HookFormDropDownListWithRemoteData } from '../../shared/components/ReactHookForm/HookFormDropDownListRemoteData'
import { GsmCardList } from '../../interfaces/GsmCardList'
import { date } from 'yup/lib/locale'
import { HookFormDatePicker } from '../../shared/components/ReactHookForm/HookFormDatePicker'
import { HookFormCheckbox } from '../../shared/components/ReactHookForm/HookFormCheckbox'

const formValidator = (values: any) => {
    return {}
}

interface IGsmCardListFormProps {
    mode: string
    title: string
    dataId: number
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function GsmCardListForm(props: IGsmCardListFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const initialFormData: GsmCardList = {
        Id: 0,
        gsmNumber: '',
        locked: true,
        purchaseDate: new Date,
        owned: true,
        status: '',
        customerName: '',
        vehicleNumber: '',
        notes: '',

    }
    const [formState, setFormState] = useState('init')
    const [errorMessage, setErrorMessage] = useState('')

    const validationSchema = Yup.object().shape({

        Id: Yup.number().required(t('DataIsRequired', { data: t('GsmCardListId') })),

        gsmNumber: Yup.string().required(t('DataIsRequired', { data: t('GsmListNumber') })),

        locked: Yup.bool().required(t('DataIsRequired', { data: t('Locked') })),

        purchaseDate: Yup.number().required(t('DataIsRequired', { data: t('GsmCardListDate') })),

        owned: Yup.bool().required(t('DataIsRequired', { data: t('Owned') })),

        status: Yup.string().required(t('DataIsRequired', { data: t('Status') })),

        customerName: Yup.string().required(t('DataIsRequired', { data: t('CustomerName') })),

        vehicleNumber: Yup.string().required(t('DataIsRequired', { data: t('VehicleNumber') })),

        notes: Yup.string().required(t('DataIsRequired', { data: t('Notes') })),


    });

    const insertValidationSchema = Yup.object().shape({

        Id: Yup.number().required(t('DataIsRequired', { data: t('GsmCardListId') })),

        gsmNumber: Yup.string().required(t('DataIsRequired', { data: t('GsmListNumber') })),

        locked: Yup.bool().required(t('DataIsRequired', { data: t('Locked') })),

        purchaseDate: Yup.number().required(t('DataIsRequired', { data: t('GsmCardListDate') })),

        owned: Yup.bool().required(t('DataIsRequired', { data: t('Owned') })),

        status: Yup.string().required(t('DataIsRequired', { data: t('Status') })),

        customerName: Yup.string().required(t('DataIsRequired', { data: t('CustomerName') })),

        vehicleNumber: Yup.string().required(t('DataIsRequired', { data: t('VehicleNumber') })),

        notes: Yup.string().required(t('DataIsRequired', { data: t('Notes') })),



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
    } = useForm<GsmCardList>({
        //resolver: yupResolver(mode === 'add' ? insertValidationSchema : validationSchema)
    })

    useEffect(() => {
        if (mode === 'edit') {
            loadData()
        } else {
            setFormState('')
        }
    }, [mode])

    function loadData() {
        setFormState('loading')
        let url = `api/gsmcardlist/${dataId}`
        axios
            .get(url)
            .then((response) => {
                console.log('Response Data:', response.data)
                //setFormData(response.data)
                reset({
                    Id: response.data.gsm_card_id,
                    gsmNumber: response.data.gsm_number,
                    locked: response.data.locked,
                    purchaseDate: response.data.purchase_date,
                    owned: response.data.owned,
                    status: response.data.status,
                    customerName: response.data.member_name,
                    vehicleNumber: response.data.vehicle_number,
                    notes: response.data.notes,

                })
                setFormState('')
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(t('FailedToLoadData'))
                setFormState('error')
            })
    }

    // function handleSubmit(dataItem: any) {
    //     console.log('handleSubmit(): ' + JSON.stringify(dataItem))
    // }

    const onSubmit = handleSubmit((data) => {
        console.log('onSubmit() data = ', data)
        let url = 'api/gsmcardlist/'
        if (mode === 'add') {
            url = url + 'add';
            data.Id = 0;
        }
        else {
            url = url + 'update';
            data.Id = dataId;
        }
        axios
            .post(url, data)
            .then((response) => {
                if (response.data.success) {
                    setFormState('submitted')
                    if (onSuccess) onSuccess(data, response.data.result)
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
    })

    console.log('formData', initialFormData)

    return (
        <Dialog title={title} onClose={onClose} width="560px">
            <div className='w-100 h-100'>
                <form id='myForm' onSubmit={onSubmit}>
                    <div className='k-form k-form-horizontal'>
                        {errorMessage && (
                            <div className={'k-messagebox k-messagebox-error'}>
                                {errorMessage}
                            </div>
                        )}
                     
                        <HookFormInput
                            name='gsmNumber'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('GsmListNumber')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormCheckbox
                            name='locked'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('Locked')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormDatePicker
                            name='purchaseDate'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('GsmCardListDate')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormCheckbox
                            name='owned'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('Owned')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='status'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('Status')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='customerName'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('CustomerName')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        
                        <HookFormInput
                            name='vehicleNumber'

                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('VehicleNumber')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                       
                         />
                        <HookFormInput
                            name='notes'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('Notes')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />


                    </div>
                </form>
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

export default GsmCardListForm
