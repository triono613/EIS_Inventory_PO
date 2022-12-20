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
import { AvlUnitList } from '../../interfaces/AvlUnitList'
import { date } from 'yup/lib/locale'
import { HookFormDatePicker } from '../../shared/components/ReactHookForm/HookFormDatePicker'

const formValidator = (values: any) => {
    return {}
}

interface IAvlUnitListFormProps {
    mode: string
    title: string
    dataId: number
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function AvlUnitListForm(props: IAvlUnitListFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const initialFormData: AvlUnitList = {
        deviceId: 0,
        serialNumber: '',
        imei: '',
        avlUnitId: '',
        avlUnitTypeDesc: '',
        purchaseDate: new Date,

    }
    const [formState, setFormState] = useState('init')
    const [errorMessage, setErrorMessage] = useState('')

    const validationSchema = Yup.object().shape({

        deviceId: Yup.number().required(t('DataIsRequired', { data: t('AvlUnitListDevice') })),

        serialNumber: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListSerial') })),

        imei: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListImei') })),

        avlUnitId: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListId') })),

        avlUnitTypeDesc: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListDesc') })),

        purchaseDate: Yup.number().required(t('DataIsRequired', { data: t('AvlUnitListDate') })),


    });

    const insertValidationSchema = Yup.object().shape({

        deviceId: Yup.number().required(t('DataIsRequired', { data: t('AvlUnitListDevice') })),

        serialNumber: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListSerial') })),

        imei: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListImei') })),

        avlUnitId: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListId') })),

        avlUnitTypeDesc: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitListDesc') })),

        purchaseDate: Yup.number().required(t('DataIsRequired', { data: t('AvlUnitListDate') })),


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
    } = useForm<AvlUnitList>({
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
        let url = `api/avlunitlist/${dataId}`
        axios
            .get(url)
            .then((response) => {
                console.log('Response Data:', response.data)
                //setFormData(response.data)
                reset({
                    deviceId: response.data.device_id,
                    serialNumber: response.data.serial_number,
                    imei: response.data.imei,
                    avlUnitId: response.data.avl_unit_id,
                    avlUnitTypeDesc: response.data.avl_unit_desc,
                    purchaseDate: response.data.purchase_date,

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
        let url = 'api/avlunitlist/'
        if (mode === 'add') {
            url = url + 'add';
            data.deviceId = 0;
        }
        else {
            url = url + 'update';
            data.deviceId = dataId;
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
                            name='deviceId'
                            type="number"
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitListDevice')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='serialNumber'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitListSerial')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='imei'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitListImei')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='avlUnitId'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitListId')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='avlUnitTypeDesc'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitListDesc')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormDatePicker
                            name='purchaseDate'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitListDate')}
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

export default AvlUnitListForm
