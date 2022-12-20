
// import { t } from 'i18next'
// import { default as i18n  } from 'i18next'
import { useTranslation } from "react-i18next";
import { control } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { Button } from "@progress/kendo-react-buttons";
import { HookFormInput } from '../../../shared/components/ReactHookForm/HookFormInput';

import { MyFormState } from "../../../classes/MyFormState";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../../../setup';

import { useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Supplier } from '../../../interfaces/Supplier'
import * as Yup from 'yup';

import { useForm } from "react-hook-form";
import { dataLoaded } from '../SupplierSlice';
import axios from 'axios'
import toast from 'react-hot-toast'
import { HookFormCheckbox } from '../../../shared/components/ReactHookForm/HookFormCheckbox';
import { HookFormDropDownListWithRemoteData } from '../../../shared/components/ReactHookForm/HookFormDropDownListRemoteData';
import { HookFormComboBoxWithRemoteData } from '../../../shared/components/ReactHookForm/HookFormComboBoxRemoteData';
import { HookFormDropDownList } from '../../../shared/components/ReactHookForm/HookFormDropDownList';
import { CurrencyDisplayOptions } from "@telerik/kendo-intl";
import { HookFormTextArea } from "../../../shared/components/ReactHookForm/HookFormTextArea";


export function SupplierForm() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const supplierState = useSelector((state: RootState) => state.supplier);
    const params: { id: string } = useParams();
    const history = useHistory();


  const validationSchema = Yup.object().shape({
      supplier_name: Yup.string()
          .required( t('DataIsRequired', { data: t('SupplierName') }))
          .min(4, t('DataMustBeAtLeastNCharacters', { data: t('SupplierName'), n: 4 })),
       supplier_code: Yup.string()
          .required( t('DataIsRequired', { data: t('SupplierCode') })),
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
  } = useForm<Supplier>({
      resolver: yupResolver(validationSchema)
  })


  const initialFormData: Supplier = {
        supplier_id: '', 
        supplier_name: '',
        supplier_code: '',
        vat_number: '',
        notes: '',
        is_taxable: true,
        tax_rate_id: 0,
        currency: 'IDR', 
        bank_name: '',
        bank_branch: '',
        bank_account_name: '',
        bank_account_number: '',
        payment_terms_id: 0,
        delivery_lead_time: 0,
        address_id: '',
        address_name: '',
        address_lines: '',
        city: '',
        state: '',
        zip_code: '',
        country_code: '',
        country_name: '',
        payment_terms_desc: ''
}

  useEffect(() => {
    if (supplierState.state === 'loaded') {
        reset(supplierState.data!)
        setFormState('view')
    }
    else if (supplierState.state === 'new') {
        reset(initialFormData);
        setFormState('editing')
    }
  }, [supplierState])

  console.log('supplierState.state->',supplierState.state);

  const [formState, setFormState] = useState<MyFormState>('')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = handleSubmit((data) => {
    console.log('supplierState.state= ', supplierState.state);
    console.log('onSubmit() data = ', data)
    if (supplierState.state === 'new')
        doRegister(data)
    else
        doUpdate(data)
})


function doUpdate(data: Supplier) {
  let url = 'api/supplier/update'
  data.supplier_id = params.id;
  axios
      .post(url, data)
      .then((response) => {
          console.log('Response.data', response.data)
          if (response.data.success) {
              dispatch(dataLoaded(response.data.result))
              reset(response.data.result)
              setFormState('view')
              //if (onSuccess) onSuccess(data, response.data.result)
              let message = t('DataHasBeenUpdated', { data: data.supplier_name })
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
          setErrorMessage( t('FailedToSubmitToServer'))
      })
}

function doRegister(data: Supplier) {
    let url = 'api/supplier/create'
    axios
        .post(url, data)
        .then((response) => {
            console.log('Response.data', response.data)
            if (response.data.success) {
                const newData = response.data.result
                dispatch(dataLoaded(newData))
                reset(newData)
                setFormState('view')
                //if (onSuccess) onSuccess(data, response.data.result)
                let message = t('DataHasBeenCreated', { data: newData.supplier_name })
                toast.success(message)
                history.push('/supplier')
            } else {
                setFormState('editing')
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

function onEditClicked() {
  setFormState('editing')
}



function onCancelClicked() {

    console.log('supplierState.state= ', supplierState.state);

  if (supplierState.state === 'new' || supplierState.state === 'loaded') {
      // back to member page
      history.push('/supplier')
  }
  else {
      // resetForm
      reset(supplierState.data!)
      setFormState('view')
  }
}


const CURR = [
        { id: 'IDR', text: t('IDR') },
        { id: 'USD', text: t('USD') },
    ]


// let isDisabled = formState !== 'editing'
let isDisabled = false

console.log('formState: ',formState);

return (
      <div className='w-100 h-100 d-flex flex-column'>
      {/* toolbar */}
      <div className='container-fluid h-60px d-flex flex-row align-items-center gap-2 flex-shrink-0 bg-white' style={{ borderBottomStyle: 'solid', borderBottomColor: '#eff2f5', borderBottomWidth: '1px' }}>
          {formState === 'view' && (
              <>
                  <Button primary={true} togglable={false} className='w-80px' onClick={onEditClicked}>
                      { t('Edit')}
                  </Button>
                  <div className="vr ms-1" style={{ height: '40px'}}></div>
                
              </>
          )}
          {formState === 'editing' && (
              <>
                  <Button primary={true} type='submit' form='myForm' togglable={false} className='w-80px'>
                      { t('Save')}
                  </Button>
                  <Button primary={false} togglable={false} className='w-80px' onClick={onCancelClicked}>
                      { t('Cancel')}
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
                      <legend className='k-form-legend'>Informasi Supplier </legend>
                      <HookFormInput
                          name='supplier_name'
                          control={control}
                          label={ t('SupplierName')}
                          disabled={isDisabled}
                      />
                      <HookFormInput
                          name='supplier_code'
                          control={control}
                          label={ t('SupplierCode')}
                          disabled={isDisabled}
                      />
                      <HookFormInput
                      name="vat_number"
                      control={control} 
                      label={ t('VatNumber')}
                      disabled={isDisabled}
                      />
                       <HookFormTextArea
                      name="notes"
                      control={control} 
                      label={ t('Notes')}
                      disabled={isDisabled}
                      />
                </fieldset>
                <fieldset className="k-form-fieldset">
                      <legend className='k-form-legend'>Informasi Bank </legend>
                      <HookFormCheckbox
                          name='is_taxable'
                        //   checked= {true}
                          control={control}
                          label={ t('TaxAble')}
                        //   disabled={isDisabled}
                           //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                           //defaultValue={initialFormData.userName}
                      />
                    <HookFormDropDownList
                        name='currency'
                        control={control}
                        // defaultValue={initialFormData.currency}
                        label={t('SupplierCurrency')}
                        data={CURR}
                        // onChange={onGeofenceTypeChange}
                        />
                    <HookFormInput
                      name="bank_name"
                      control={control} 
                      label={ t('BankName')}
                      disabled={isDisabled}
                      />
                    <HookFormInput
                      name="bank_branch"
                      control={control} 
                      label={ t('BankBranch')}
                      disabled={isDisabled}
                      />
                    <HookFormInput
                      name="bank_account_name"
                      control={control} 
                      label={ t('BankAccountName')}
                      disabled={isDisabled}
                      />
                    <HookFormInput
                      name="bank_account_number"
                      control={control} 
                      label={ t('BankAccountNumber')}
                      disabled={isDisabled}
                      />
                    <HookFormComboBoxWithRemoteData
                        name='payment_terms_id'
                        control={control}
                        label={t('PaymentTermsId')}
                        dataUrl='api/PaymentTerms/list'
                        disabled={isDisabled}
                    />
            </fieldset>
            <fieldset className="k-form-fieldset">
                    <legend className='k-form-legend'>Informasi Alamat </legend>
                    <HookFormInput
                      name="delivery_lead_time"
                      control={control} 
                      label={ t('DeliveryLeadTime')}
                      disabled={isDisabled}
                      />
                    {/* <HookFormInput
                      name="address_id"
                      control={control} 
                      label={ t('AddressId')}
                      disabled={isDisabled}
                      /> */}
                    <HookFormInput
                      name="address_name"
                      control={control} 
                      label={ t('AddressName')}
                      disabled={isDisabled}
                      />
                     <HookFormInput
                      name="address_lines"
                      control={control} 
                      label={ t('AddressLine')}
                      disabled={isDisabled}
                      />
                    <HookFormInput
                      name="city"
                      control={control} 
                      label={ t('SupplierCity')}
                      disabled={isDisabled}
                      />
                    <HookFormInput
                      name="state"
                      control={control} 
                      label={ t('SupplierState')}
                      disabled={isDisabled}
                      />
                     <HookFormInput
                      name="zipcode"
                      control={control} 
                      label={ t('ZipCode')}
                      disabled={isDisabled}
                      />
                  
                   <HookFormComboBoxWithRemoteData
                        name='country_code'
                        control={control}
                        label={t('CountryCode')}
                        dataUrl='api/country/list'
                        disabled={isDisabled}
                     />   
                    {/* <HookFormInput
                      name="country_name"
                      control={control} 
                      label={ t('CountryName')}
                      disabled={isDisabled}
                      /> */}
                   
                  
                  </fieldset>
             
              </div>
          </form>
      </div>
  </div>
    )
}