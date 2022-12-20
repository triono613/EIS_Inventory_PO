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
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { HookFormInput } from '../../shared/components/ReactHookForm/HookFormInput'
import { HookFormDropDownList } from '../../shared/components/ReactHookForm/HookFormDropDownList'
import { HookFormDropDownListWithRemoteData } from '../../shared/components/ReactHookForm/HookFormDropDownListRemoteData'
import { User } from '../../interfaces/User'

const formValidator = (values: any) => {
    return {}
}

interface IUserFormProps {
    mode: string
    title: string
    dataId: number
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function UserForm(props: IUserFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const initialFormData: User = {
        id: 0,
        userName: '',
        userFullName: '',
        roleId: 0,
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    }
    const [formState, setFormState] = useState('init')
    const [errorMessage, setErrorMessage] = useState('')

    const validationSchema = Yup.object().shape({
        userName: Yup.string()
            .required(t('DataIsRequired', { data: t('UserName') }))
            .min(4, t('DataMustBeAtLeastNCharacters', { data: t('UserName'), n: 4 })),
        userFullName: Yup.string().required(t('DataIsRequired', { data: t('UserFullName') })),
        email: Yup.string()
            .email(t('DataIsInvalid', { data: 'Email' })),
        roleId: Yup.number()
            .required(t('DataIsRequired', { data: t('UserType') }))
            .min(1, t('DataIsRequired', { data: t('UserType') })),
        confirmPassword: Yup.string()
            // .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], t('ConfirmPasswordNotMatch')),
    });

    const insertValidationSchema = Yup.object().shape({
        userName: Yup.string()
            .required(t('DataIsRequired', { data: t('UserName') }))
            .min(4, t('DataMustBeAtLeastNCharacters', { data: t('UserName'), n: 4 })),
        //.max(20, 'Username must not exceed 20 characters'),
        userFullName: Yup.string().required(t('DataIsRequired', { data: t('UserFullName') })),
        email: Yup.string()
            .email(t('DataIsInvalid', { data: 'Email' })),
        roleId: Yup.number()
            .required(t('DataIsRequired', { data: t('UserType') }))
            .min(1, t('DataIsRequired', { data: t('UserType') })),
        password: Yup.string()
            .required(t('DataIsRequired', { data: "Password" }))
            .min(6, t('DataMustBeAtLeastNCharacters', { data: 'Password', n: 6 })),
        //.max(40, 'Password must not exceed 40 characters'),
        confirmPassword: Yup.string()
            // .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], t('ConfirmPasswordNotMatch')),
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
    } = useForm<User>({
        resolver: yupResolver(mode === 'add' ? insertValidationSchema : validationSchema)
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
        let url = `api/user/${dataId}`
        axios
            .get(url)
            .then((response) => {
                console.log('Response Data:', response.data)
                //setFormData(response.data)
                reset({
                    id: response.data.id,
                    userName: response.data.userName,
                    userFullName: response.data.userFullName,
                    roleId: response.data.roleId,
                    email: response.data.email,
                    phone: response.data.phone,
                    password: '',
                    confirmPassword: ''
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
        let url = 'api/user/'
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

    // function handleSubmitClick(e: any) {
    //     if (!e.isValid) return
    //     setErrorMessage('')
    //     setFormState('submitting')
    //     let url = 'api/user/'
    //     if (mode === 'add') {
    //         url = url + 'add';
    //     }
    //     else {
    //         url = url + 'update'
    //     }
    //     var data = {
    //         Id: mode === 'add' ? 0 : dataId,
    //         UserName: e.values.UserName,
    //         UserFullName: e.values.UserFullName,
    //         UserType: stateUserType.value.id,
    //         Email: e.values.Email,
    //         Phone: e.values.Phone,
    //         Password: e.values.Password,
    //         ConfrimPassword: e.values.ConfrimPassword
    //     }
    //     axios
    //         .post(url, data)
    //         .then((response) => {
    //             if (response.data.success) {
    //                 setFormState('submitted')
    //                 if (onSuccess) onSuccess(e.values, response.data.result)
    //             } else {
    //                 setFormState('')
    //                 setErrorMessage(response.data.errorMessage)
    //             }
    //         })
    //         .catch((error) => {
    //             setFormState('')
    //             setErrorMessage(t('FailedToSubmitToServer'))
    //         })
    // }

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
                            name='userName'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('UserName')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                        <HookFormInput
                            name='userFullName'
                            control={control}
                            //defaultValue={initialFormData.userFullName}
                            label={t('UserFullName')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserFullName') }) }}
                        />
                        <HookFormInput 
                            name='email'
                            control={control}
                            //defaultValue={initialFormData.email}
                            label={t('Email')}
                        />
                        <HookFormDropDownListWithRemoteData
                            name='roleId'
                            control={control}
                            //defaultValue={initialFormData.roleId}
                            label={t('UserType')}
                            dataUrl='/api/role/list'
                            filterable={false}
                        //rules={{ required: t('DataIsRequired', { data: t('UserType') }) }}
                        />
                        <HookFormInput
                            name='password'
                            control={control}
                            //defaultValue={initialFormData.password}
                            label={t('NewPassword')}
                            type={'password'}
                        />
                        <HookFormInput
                            name='confirmPassword'
                            control={control}
                            //defaultValue={initialFormData.confirmPassword}
                            label={t('ConfirmPassword')}
                            type={'password'}
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

export default UserForm
