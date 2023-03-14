import {Dialog} from '@progress/kendo-react-dialogs'
import {Form, Field, FormElement} from '@progress/kendo-react-form'
import {Input, NumericTextBox} from '@progress/kendo-react-inputs'
import {DropDownList} from '@progress/kendo-react-dropdowns'
import {Error} from '@progress/kendo-react-labels'
import {HookFormComboBoxWithRemoteData} from '../../../shared/components/ReactHookForm/HookFormComboBoxRemoteData'
// import categories from "./categories.json";
import {control} from 'leaflet'
import {useForm} from 'react-hook-form'
import {Product} from '../../../interfaces/Product'
import {yupResolver} from '@hookform/resolvers/yup'
import axios from 'axios'
import {HookFormDropDownList} from '../../../shared/components/ReactHookForm/HookFormDropDownList'
import React, {useEffect, useState} from 'react'
import { SelectCustomer } from '../../../shared/components/SelectCustomer/SelectCustomer'
import { SelectProductInv } from '../../../shared/components/SelectProduct/SelectProductInv'
// import { ProductList } from '../../product/ProductList'

const minValueValidator = (value: any) => (value >= 0 ? '' : 'The value must be 0 or higher')

const NonNegativeNumericInput = (fieldRenderProps: any) => {
    const {validationMessage, visited, ...others} = fieldRenderProps
    return (
        <div>
            <NumericTextBox {...others} />
            {visited && validationMessage && <Error>{validationMessage}</Error>}
        </div>
    )
}

interface ProductPo {
    id: number;
    name: string;
    // group: string,
    // invsku: string,
    // stock:  string
}

const PoEditForm = (props: any) => {
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        control,
        watch,
        getValues,
        formState: {errors},
    } = useForm<Product>()

    let isDisabled = false

    const [inputValue, setInputValue] = useState('')
    const initialValueDdl = [{id: 0, name: ' --- Select a Product ---'}]
    const [inputValueDdl, setInputValueDdl] = useState(initialValueDdl)

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        const target = event.target
        const selectedOption = inputValueDdl.find(
            (option) => option.id.toString() === selectedValue
        )
        console.log('target= ', target)
        console.log('selectedValue= ', selectedValue)

        // setInputValue(selectedOption ? selectedOption.name : '')
    }

    function getDataDdlProduct() {
        let url = 'api/InventoryItem/list'
        axios.get(url).then((response) => {
            setInputValueDdl(response.data)
        })
    }

    console.log('inputValueDdl= ', inputValueDdl)

    useEffect(() => {
        getDataDdlProduct()
    }, [])


    function onDdlChange(value1: number,value2: string) {
        // setCustomerxId(value)
        console.log('valuex= ',value1+'-'+value2)
        setInputValue(value2)
    }
   

    return (
        // <Dialog title={`Edit ${props.item.ProductName}`} onClose={props.cancelEdit}>
        <Dialog title={'Add Item'} onClose={props.cancelEdit} width='560px'>
            <div className=''>
                <Form
                    onSubmit={props.onSubmit}
                    initialValues={props.item}
                    render={(formRenderProps) => (
                        <FormElement
                            style={{
                                maxWidth: 1050,
                            }}
                        >
                            <fieldset className={'k-form-fieldset'}>
                                {/* <HookFormComboBoxWithRemoteData
                                    // onChange={handleChange}
                                    name='ProductName'
                                    control={control}
                                    label={'Product'}
                                    dataUrl='api/InventoryGroup/list'
                                    //dataUrl='api/PaymentTerms/list'
                                    disabled={isDisabled}
                                /> */}
                                <div className='mb-3'>
                                    <div className='d-flex align-items-center mr-10 mb-3'>
                                        <div className='ms-2'>
                                            <span>Product</span>
                                        </div>
                                        <div className='ms-2'>
                                            <SelectProductInv  onChange={onDdlChange} />
                                        </div>
                                    </div>
                                     {/* <Field
                                        // value={inputValue} 
                                        name={'ProductName2'}
                                        component={NonNegativeNumericInput}
                                        label={'ProductName2'}
                                        validator={undefined}
                                         />  */}
                                         <input type="text" placeholder="" value={inputValue} name={'ProductName2'} />
                                </div>
                                <div className='mb-3'>
                                    <Field
                                        name={'UnitPrice'}
                                        component={NonNegativeNumericInput}
                                        label={'Price'}
                                        validator={minValueValidator}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <Field
                                        name={'qty'}
                                        component={NonNegativeNumericInput}
                                        label={'Qty'}
                                        validator={minValueValidator}
                                    />
                                </div>
                                {/* <div className='mb-3'>
                                    <Field
                                        name={'UnitsInStock'}
                                        component={NonNegativeNumericInput}
                                        label={'Availability'}
                                        validator={minValueValidator}
                                    />
                                </div> */}

                                <div className='mb-3'>
                                    <Field
                                        name={'Discount'}
                                        component={NonNegativeNumericInput}
                                        label={'Discount'}
                                        validator={minValueValidator}
                                    />
                                </div>
                            </fieldset>
                            <div className='k-form-buttons'>
                                <button
                                    type={'submit'}
                                    className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary'
                                    disabled={!formRenderProps.allowSubmit}
                                >
                                    Update
                                </button>
                                <button
                                    type={'submit'}
                                    className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base'
                                    onClick={props.cancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </FormElement>
                    )}
                />
            </div>
        </Dialog>
    )
}
export default PoEditForm
