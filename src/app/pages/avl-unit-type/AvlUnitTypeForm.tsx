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
import { AvlUnitType } from '../../interfaces/AvlUnitType'

const formValidator = (values: any) => {
    return {}
}

interface IAvlUnitTypeFormProps {
    mode: string
    title: string
    dataId: number
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function AvlUnitTypeForm(props: IAvlUnitTypeFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const initialFormData: AvlUnitType = {
        id: 0,
        avlUnitTypeCode: 0,
        avlUnitTypeDesc: '',
        
    }
    const [formState, setFormState] = useState('init')
    const [errorMessage, setErrorMessage] = useState('')

    const validationSchema = Yup.object().shape({

        avlUnitTypeCode: Yup.number().required(t('DataIsRequired', { data: t('AvlUnitTypeCode') })),

        avlUnitTypeDesc: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitTypeDesc') })),
        
      
    });

    const insertValidationSchema = Yup.object().shape({
       
        avlUnitTypeCode: Yup.number().required(t('DataIsRequired', { data: t('AvlUnitTypeCode') })),
        avlUnitTypeDesc: Yup.string().required(t('DataIsRequired', { data: t('AvlUnitTypeDesc') })),
        
        
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
    } = useForm<AvlUnitType>({
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
        let url = `api/avlunittype/${dataId}`
        axios
            .get(url)
            .then((response) => {
                console.log('Response Data:', response.data)
                //setFormData(response.data)
                reset({
                    id: response.data.avl_unit_type_id,
                    avlUnitTypeCode: response.data.avl_unit_type_code,
                    avlUnitTypeDesc: response.data.avl_unit_type_desc,
                  
                  
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
        let url = 'api/avlunittype/'
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
                            name='avlUnitTypeCode'
                            type="number"
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('AvlUnitTypeCode')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='avlUnitTypeDesc'
                            control={control}
                            //defaultValue={initialFormData.userFullName}
                            label={t('AvlUnitTypeDesc')}
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

export default AvlUnitTypeForm
