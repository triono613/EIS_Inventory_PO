import React, {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector, useDispatch} from 'react-redux'

import axios from 'axios'

//import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';

import {Form, Field, FormElement} from '@progress/kendo-react-form'
import {Error} from '@progress/kendo-react-labels'
import {Input} from '@progress/kendo-react-inputs'
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
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'

//import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

import {FormInput, FormComboBox} from '../../shared/components/form-components'
import {requiredValidator} from '../../shared/components/validators'
//import { FormDbComboBox } from "app/shared/components/DbComboBox";
//import { FormComboBoxWithValueField } from "app/shared/components/ComboBoxWithValueField";
import {getter} from '@progress/kendo-react-common'
//import {addNotification} from '../../shared/helpers/notification'

const formValidator = (values: any) => {
    return {}
}

interface ILocationTypeFormProps {
    mode: string
    title: string
    dataId: string
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function LocationTypeForm(props: ILocationTypeFormProps) {
    const {mode, title, dataId, onClose, onSuccess, ...others} = props
    const {t} = useTranslation('translation')
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        locationTypeName: '',
        locationIcon: '',
        locationIconColor: '',
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
        console.log('loadData().. dataId = ' + dataId)
        setFormState('loading')
        let url = `api/LocationType/${dataId}`
        axios
            .get(url)
            .then((response) => {
                console.log(response)
                setFormData({
                    locationTypeName: response.data.location_type_name,
                    locationIcon: response.data.icon,
                    locationIconColor: response.data.icon_color,
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
        console.log(
            `handleSubmitClick().. isModified=${e.isModified} isValid=${
                e.isValid
            } values=${JSON.stringify(e.values)}`
        ) // + JSON.stringify(e.values);
        if (!e.isValid) return
        setErrorMessage('')
        setFormState('submitting')
        let url = 'api/LocationType/'
        if (mode === 'add') url = url + 'add'
        else url = url + 'update'
        console.log(`url = ${url}, dataId = ${dataId}`)
        var data = {
            location_type_id: dataId,
            location_type_name: e.values.locationTypeName,
            icon: e.values.locationIcon,
            icon_color: e.values.locationIconColor,
        }
        axios
            .post(url, data)
            .then((response) => {
                console.log(response)
                // setSubmitting false
                if (response.data.success) {
                    setFormState('submitted')
                    // close form, display success message
                    if (onSuccess) onSuccess(data, response.data.result)
                } else {
                    setFormState('')
                    // display error messsage
                    setErrorMessage(response.data.errorMessage)
                    console.log(response.data.errorMessage)
                }
            })
            .catch((error) => {
                console.log(error)
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
                    <FormElement id='myForm' horizontal={true} style={{width: 500, maxWidth: 500}}>
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
                            id={'locationTypeName'}
                            name={'locationTypeName'}
                            label={t('LocationType')}
                            component={FormInput}
                            //disabled={mode === 'edit'}
                            validator={requiredValidator(
                                `${t('DataIsRequired', { data: t('LocationType') })}`
                            )}
                        />
                        <Field
                            id={'locationIcon'}
                            name={'locationIcon'}
                            label={t('Icon')}
                            component={FormInput}
                            //validator={nameValidator}
                        />
                        <Field
                            id={'locationIconColor'}
                            name={'locationIconColor'}
                            label={t('IconColor')}
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
                        style={{minWidth: 100}}
                        disabled={formState !== ''}
                    >
                        OK
                        {/*{formState === 'submitting' ? `${t('Saving')}...` : 'OK'}*/}
                    </Button>
                )}
                <Button onClick={onClose} style={{minWidth: 80}}>
                    {t('Cancel')}
                </Button>
            </DialogActionsBar>
        </Dialog>
    )
}

export default LocationTypeForm
