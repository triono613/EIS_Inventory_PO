import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

//import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';

import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Error } from '@progress/kendo-react-labels'
import { Input } from '@progress/kendo-react-inputs'
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

//import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

import { FormInput, FormComboBox } from '../../shared/components/form-components'
import { requiredValidator } from '../../shared/components/validators'
//import { FormDbComboBox } from "app/shared/components/DbComboBox";
//import { FormComboBoxWithValueField } from "app/shared/components/ComboBoxWithValueField";
import { getter } from '@progress/kendo-react-common'
//import {addNotification} from '../../shared/helpers/notification'

const formValidator = (values: any) => {
    return {}
}

interface ICustomerFormProps {
    mode: string
    title: string
    dataId: string
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function CustomerForm(props: ICustomerFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        customer_id: '',
        customer_code: '',
        customer_name: '',
        customer_address: '',
        phone_number: ''
    })
    const [formState, setFormState] = useState('init') // loading, submitting, submitted
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (mode === 'edit') {
            // load data
            loadData()
        } else {
            setFormState('')
        }
    }, [mode])

    useEffect(() => {
        // load roles
        //loadRoles();
    }, [])

    function loadData() {
        setFormState('loading')
        let url = `api/Customer/${dataId}`
        axios
            .get(url)
            .then((response) => {
                setFormData({
                    customer_id: response.data.customer_id,
                    customer_code: response.data.customer_code,
                    customer_name: response.data.customer_name,
                    customer_address: response.data.customer_address,
                    phone_number: response.data.phone_number
                })
                setFormState('')
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(t('FailedToLoadData'))
                setFormState('error')
            })
    }

    // handleSubmit is not called when editing and the form is not modified/edit
    function handleSubmit(dataItem: any) {
        console.log('handleSubmit(): ' + JSON.stringify(dataItem))
    }

    // use handleSubmitClick to enable submit
    function handleSubmitClick(e: any) {
        if (!e.isValid) return
        setErrorMessage('')
        setFormState('submitting')
        let url = 'api/Customer/'
        if (mode === 'add') url = url + 'add'
        else url = url + 'update'
        axios
            .post(url, e.values)
            .then((response) => {
                // setSubmitting false
                if (response.data.success) {
                    setFormState('submitted')
                    // close form, display success message
                    if (onSuccess) onSuccess(e.values, response.data.result)
                } else {
                    setFormState('')
                    // display error messsage
                    setErrorMessage(response.data.errorMessage)
                }
            })
            .catch((error) => {
                setFormState('')
                // display error messsage
                setErrorMessage(t('FailedToSubmitToServer'))
            })
    }

    return (
        <Dialog title={title} onClose={onClose}>
            <Form
                initialValues={formData}
                key={JSON.stringify(formData)}
                onSubmit={handleSubmit}
                onSubmitClick={handleSubmitClick}
                validator={formValidator}
                render={(formRenderProps) => (
                    <FormElement id='myForm' horizontal={true} style={{ width: 500, maxWidth: 500 }}>
                        {errorMessage && (
                            <div className={'k-messagebox k-messagebox-error'}>{errorMessage}</div>
                        )}
                        {formRenderProps.visited &&
                            formRenderProps.errors &&
                            formRenderProps.errors.VALIDATION_SUMMARY && (
                                <div className={'k-messagebox k-messagebox-error'}>
                                    {formRenderProps.errors.VALIDATION_SUMMARY}
                                </div>
                            )}
                        <Field
                            id={'customer_code'}
                            name={'customer_code'}
                            label={t('CustomerCode')}
                            component={FormInput}
                            disabled={mode === 'edit'}
                            validator={requiredValidator(
                                `${t('DataIsRequired', { data: t('CustomerCode') })}`
                            )}
                        />
                        <Field
                            id={'customer_name'}
                            name={'customer_name'}
                            label={t('CustomerName')}
                            component={FormInput}
                            validator={requiredValidator(
                                `${t('DataIsRequired', { data: t('CustomerName') })}`
                            )}
                        />
                        <Field
                            id={'customer_address'}
                            name={'customer_address'}
                            label={t('CustomerAddress')}
                            component={FormInput}
                        //validator={emailValidator}
                        />
                        <Field
                            id={'phone_number'}
                            name={'phone_number'}
                            label={t('PhoneNumber')}
                            component={FormInput}
                        //validator={emailValidator}
                        />
                    </FormElement>
                )}
            />
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

export default CustomerForm
