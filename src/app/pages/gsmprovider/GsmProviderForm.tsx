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
import { GsmProvider } from '../../interfaces/GsmProvider'

const formValidator = (values: any) => {
    return {}
}

interface IGsmProviderFormProps {
    mode: string
    title: string
    dataId: number
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function GsmProviderForm(props: IGsmProviderFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const initialFormData: GsmProvider = {
        id: 0,
        gsmProviderName: '',
        gsmPrefixes: '',
        GsmProviderInventory: 0,
    }
    const [formState, setFormState] = useState('init')
    const [errorMessage, setErrorMessage] = useState('')

    const validationSchema = Yup.object().shape({
        gsmProviderName: Yup.string()
            .required(t('DataIsRequired', { data: t('GsmProviderName') }))
            .min(4, t('DataMustBeAtLeastNCharacters', { data: t('GsmProviderName'), n: 4 })),
        gsmPrefixes: Yup.string().required(t('DataIsRequired', { data: t('GsmPrefixes') })),
        GsmProviderInventory: Yup.number().required(t('DataIsRequired', { data: t('GsmProviderInventory') })),
      
    });

    const insertValidationSchema = Yup.object().shape({
        gsmProviderName: Yup.string()
            .required(t('DataIsRequired', { data: t('GsmProviderName') }))
            .min(4, t('DataMustBeAtLeastNCharacters', { data: t('GsmProviderName'), n: 4 })),
        //.max(20, 'Name must not exceed 20 characters'),
        gsmPrefixes: Yup.string().required(t('DataIsRequired', { data: t('GsmPrefixes') })),
        GsmProviderInventory: Yup.number().required(t('DataIsRequired', { data: t('GsmProviderInventory') })),
        
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
    } = useForm<GsmProvider>({
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
        let url = `api/gsmprovider/${dataId}`
        axios
            .get(url)
            .then((response) => {
                console.log('Response Data:', response.data)
                //setFormData(response.data)
                reset({
                    id: response.data.gsm_provider_id,
                    gsmProviderName: response.data.gsm_provider_name,
                    gsmPrefixes: response.data.gsm_prefixes,
                    GsmProviderInventory: response.data.inventory_item_id,
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
        debugger;
        console.log(data.GsmProviderInventory)
        //data.GsmProviderInventory != null ? data.GsmProviderInventory = parseInt(data.GsmProviderInventory.toString()) : null
        console.log(data.GsmProviderInventory)
        console.log('onSubmit() data = ', data)
        let url = 'api/gsmprovider/'
        if (mode === 'add') {
            url = url + 'add';
            data.id = 0;
        }
        else {
            url = url + 'update';
            data.id = dataId;
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
                            name='gsmProviderName'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('GsmProviderName')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='gsmPrefixes'
                            control={control}
                            //defaultValue={initialFormData.userFullName}
                            label={t('GsmPrefixes')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserFullName') }) }}
                        />
                        <HookFormInput
                            name='GsmProviderInventory'
                            type="number"
                            control={control}
                            //defaultValue={initialFormData.userFullName}
                            label={t('GsmProviderInventory')}
                            
                        //rules={{ required: t('DataIsRequired', { data: t('UserFullName') }) }}
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

export default GsmProviderForm
