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

import { FormInput, FormNumericTextBox, FormComboBox } from '../../shared/components/form-components'
import { requiredValidator } from '../../shared/components/validators'
import { ComboBox, DropDownList } from '@progress/kendo-react-dropdowns'
import { NumericTextBox } from '@progress/kendo-react-inputs'
import { Label } from '@progress/kendo-react-labels'

const formValidator = (values: any) => {
    return {}
}

interface IVehicleTypeFormProps {
    mode: string
    title: string
    dataId: string
    onClose: () => void
    onSuccess: (data: any, responseData: any) => void
}

function VehicleTypeForm(props: IVehicleTypeFormProps) {
    const { mode, title, dataId, onClose, onSuccess, ...others } = props
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        Id: '',
        VehicleTypeCode: '',
        VehicleTypeName: '',
        Remarks: ''
    })
    const [formState, setFormState] = useState('init')
    const [errorMessage, setErrorMessage] = useState('')
    
    const [valueMaxLoadWeight, setValueMaxLoadWeight] = React.useState<number | null>(0);
    const [valueMaxLoadVolume, setValueMaxLoadVolume] = React.useState<number | null>(0);
    const [valueMaxPassenger, setValueMaxPassenger] = React.useState<number | null>(0);
    const [volumeUom, setVolumeUom] = useState([]);
    const [stateVolumeUom, setStateVolumeUom] = useState({ value: { id: "", text: "" } });

    useEffect(() => {
        getUom();
        if (mode === 'edit') {
            loadData()
        } else {
            setFormState('')
        }
    }, [mode])

    function getUom(){
        let url = `api/data/GetUoms`
        axios
            .get(url)
            .then((response) => {
               setVolumeUom(response.data);
               setStateVolumeUom({ 
                    value: { 
                        id: response.data[0].id, 
                        text: response.data[0].text 
                    }
                });
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(t('FailedToLoadData'))
                setFormState('error')
            })
    }

    function loadData() {
        setFormState('loading')
        let url = `api/VehicleType/${dataId}`
        axios
            .get(url)
            .then((response) => {
                setFormData({
                    Id: response.data.vehicle_type_id,
                    VehicleTypeCode: response.data.vehicle_type_code,
                    VehicleTypeName: response.data.vehicle_type_name,
                    Remarks: response.data.remarks
                })
                setValueMaxLoadWeight(response.data.max_load_weight);
                setValueMaxLoadVolume(response.data.max_load_volume);
                setStateVolumeUom({ 
                    value: { 
                        id: response.data.max_load_volume_uom_id, 
                        text: response.data.max_load_volume_uom_code 
                    }
                });
                setValueMaxPassenger(response.data.max_passenger);
                setFormState('')
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(t('FailedToLoadData'))
                setFormState('error')
            })
    }

    function handleSubmit(dataItem: any) {
        console.log('handleSubmit(): ' + JSON.stringify(dataItem))
    }

    function handleSubmitClick(e: any) {
        if (!e.isValid) return
        setErrorMessage('')
        setFormState('submitting')
        let url = 'api/VehicleType/'
        if (mode === 'add') {
            url = url + 'add';
        }
        else {
            url = url + 'update'
        }
        var data = {
            vehicle_type_id: dataId,
            vehicle_type_code: e.values.VehicleTypeCode,
            vehicle_type_name: e.values.VehicleTypeName,
            max_load_weight: valueMaxLoadWeight,
            max_load_volume: valueMaxLoadVolume,
            max_load_volume_uom_id: stateVolumeUom.value.id,
            max_passenger: valueMaxPassenger,
            remarks: e.values.Remarks
        }
        axios
            .post(url, data)
            .then((response) => {
                if (response.data.success) {
                    setFormState('submitted')
                    if (onSuccess) onSuccess(e.values, response.data.result)
                } else {
                    setFormState('')
                    setErrorMessage(response.data.errorMessage)
                }
            })
            .catch((error) => {
                setFormState('')
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
                            id={'VehicleTypeCode'}
                            name={'VehicleTypeCode'}
                            label={t('Code')}
                            component={FormInput}
                            disabled={mode === 'edit'}
                            validator={requiredValidator(
                                `${t('DataIsRequired', { data: t('VehicleTypeCode') })}`
                            )}
                        />
                        <Field
                            id={'VehicleTypeName'}
                            name={'VehicleTypeName'}
                            label={t('Name')}
                            component={FormInput}
                        />
                        <FieldWrapper>
                            <Label editorId={t('MaxLoadWeight')}> 
                                {t('MaxLoadWeight')}
                            </Label>
                            <div className={'k-form-field-wrap'}>
                                <NumericTextBox
                                    name={'MaxLoadWeight'}
                                    value={valueMaxLoadWeight}
                                    onChange={(event) => {
                                        setValueMaxLoadWeight(event.value);
                                    }}
                                />
                            </div>
                            <div style={{width: '150px', paddingLeft: '5px', paddingTop: '5px'}}>
                                {" "}Kg
                            </div>
                        </FieldWrapper>
                        <FieldWrapper>
                            <Label editorId={t('MaxLoadVolume')}>
                                {t('MaxLoadVolume')}
                            </Label>
                            <div className={'k-form-field-wrap'}>
                                <NumericTextBox
                                    name={'MaxLoadVolume'} 
                                    value={valueMaxLoadVolume}
                                    onChange={(event) => {
                                        setValueMaxLoadVolume(event.value);
                                    }}
                                />
                            </div>
                            <div style={{width: '150px', paddingLeft: '5px'}}>
                                <DropDownList 
                                    onChange={(event) => {
                                        setStateVolumeUom({
                                            value: event.target.value,
                                        });
                                    }}
                                    value={stateVolumeUom.value}
                                    name={'MaxLoadVolumeUom'}
                                    data={volumeUom}
                                    textField="text"
                                    dataItemKey="id"
                                />
                            </div>
                        </FieldWrapper>
                        <FieldWrapper>
                            <Label editorId={t('MaxPassenger')}>
                                {t('MaxPassenger')}
                            </Label>
                            <div style={{width: '215px'}}>
                                <NumericTextBox
                                    name={'MaxPassenger'}
                                    value={valueMaxPassenger}
                                    onChange={(event) => {
                                        setValueMaxPassenger(event.value);
                                    }}
                                />
                            </div>
                        </FieldWrapper>
                        <Field
                            id={'Remarks'}
                            name={'Remarks'}
                            label={t('Remarks')}
                            component={FormInput}
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

export default VehicleTypeForm
