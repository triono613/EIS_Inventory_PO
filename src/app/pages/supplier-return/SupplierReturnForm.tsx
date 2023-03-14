

import { useTranslation } from "react-i18next";
import { control } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { Button } from "@progress/kendo-react-buttons";
import { HookFormInput } from '../../shared/components/ReactHookForm/HookFormInput';

import { MyFormState } from "../../classes/MyFormState";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../../setup';

import { useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Product } from '../../interfaces/Product'
import * as Yup from 'yup';

import { useForm } from "react-hook-form";
import { dataLoaded } from './SupplierReturnSlice';
import axios from 'axios'
import toast from 'react-hot-toast'
import { HookFormTextArea } from "../../shared/components/ReactHookForm/HookFormTextArea";
import { SearchTextBox } from "../../shared/components/SearchTextBox/SearchTextBox";
import { Label } from "@progress/kendo-react-labels";
import { Window } from "@progress/kendo-react-dialogs";
import { HookFormComboBoxWithRemoteData } from "../../shared/components/ReactHookForm/HookFormComboBoxRemoteData";
import { HookFormDatePicker } from "../../shared/components/ReactHookForm/HookFormDatePicker";
import { SupplierListPage } from "../supplier/SupplierListPage";
import { SupplierList } from "../supplier/SupplierList";
import { PageContainer } from "../../layout/components/PageContainer";
import { PageTitle } from '../../../_metronic/layout/core'
import { Toolbar } from '../../layout/components/Toolbar'
import { MultiColumnComboBox } from "@progress/kendo-react-dropdowns";
import { SupplierReturn } from "../../interfaces/SupplierReturn";
import { Supplier } from "../../interfaces/Supplier";

interface SelectSupplierProps {
    value?: string | null
    // onChange: (value: string | null) => void
}

export function SupplierReturnForm(props: SelectSupplierProps) {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const productState = useSelector((state: RootState) => state.product);
    const params: { id: string } = useParams();
    const history = useHistory();
    const [visible, setVisible] = React.useState<boolean>(false);
    const [data, setData] = React.useState(new Array<Supplier>())
    const [valueSupp, setValueSupp] = React.useState(null)

  const validationSchema = Yup.object().shape({
    inventory_item_name: Yup.string()
          .required( t('DataIsRequired', { data: t('InventoryItemName') }))
          .min(4, t('DataMustBeAtLeastNCharacters', { data: t('InventoryItemName'), n: 4 })),
    inventory_group_id: Yup.string()
          .required( t('DataIsRequired', { data: t('InventoryGroupName') })),
        //   .min(4, t('DataMustBeAtLeastNCharacters', { data: t('InventoryGroupName'), n: 4 })),
    sku: Yup.string()
          .required( t('DataIsRequired', { data: t('InventoryItemSku') }))
          .min(4, t('DataMustBeAtLeastNCharacters', { data: t('InventoryItemSku'), n: 4 })),
    minimum_stock: Yup.string()
          .required( t('DataIsRequired', { data: t('InventoryMinStock') }))
          .min(4, t('DataMustBeAtLeastNCharacters', { data: t('InventoryMinStock'), n: 4 })),
   
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
  } = useForm<Product>({
      resolver: yupResolver(validationSchema)
  })


  const initialFormData: SupplierReturn = {
    inventory_item_id : '0',
    inventory_item_name: '',
    inventory_group_id: '0',
    inventory_group_name: '',
    sku: '',
    minimum_stock: '',
}





  const toggleDialog = () => {
    setVisible(!visible);
  };

  useEffect(() => {

    if (productState.state === 'loaded') {
        reset(productState.data!)
        setFormState('view')
    }
    else if (productState.state === 'new') {
        reset(initialFormData);
        setFormState('editing')
    }


  }, [productState])

 

  const [formState, setFormState] = useState<MyFormState>('')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = handleSubmit((data) => {
    console.log('productState.state= ', productState.state);
    console.log('onSubmit() data = ', data)
    if (productState.state === 'new')
        doRegister(data)
    else
        doUpdate(data)
})


function doUpdate(data: Product) {
  let url = 'api/InventoryItem/update'
  data.inventory_item_id = params.id;
  axios
      .post(url, data)
      .then((response) => {
          console.log('Response.data', response.data)
          if (response.data.success) {
              dispatch(dataLoaded(response.data.result))
              reset(response.data.result)
              setFormState('view')
              //if (onSuccess) onSuccess(data, response.data.result)
              let message = t('DataHasBeenUpdated', { data: data.inventory_item_name })
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

function doRegister(data: Product) {
    let url = 'api/InventoryItem/add'
    axios
        .post(url, data)
        .then((response) => {
            console.log('Response.data', response.data)
            if (response.data.success) {
                const newData = response.data.result
                dispatch(dataLoaded(newData))
                reset(newData)
                // setFormState('view')
                //if (onSuccess) onSuccess(data, response.data.result)
                let message = t('DataHasBeenCreated', { data: newData.inventory_item_name })
                toast.success(message)
                history.push('/product')
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
    console.log('productState.state= ', productState.state);
  if (productState.state === 'new' || productState.state === 'loaded') {
      // back to member page
      history.push('/purchase')
  }
  else {
      // resetForm
      reset(productState.data!)
      setFormState('view')
  }
}


const delay = 500
const dataUrl = 'api/customer/list'
const loadData = () => {
    console.log('SelectCustomer.loadData()..')
    axios
        .get(dataUrl)
        .then((response) => {
            console.log('response: ' + JSON.stringify(response))
            // setCustomers(response.data)
            setData(response.data)
            // if (props.valueSupp) {
            //     var val = response.data.find((obj: any) => {
            //         return obj.customer_id === props.valueSupp
            //     })
            //     if (val) setValueSupp(val)
            // }
            // setLoading(false)
        })
        .catch((error) => console.error(`Error: ${error}`))
}




// let isDisabled = formState !== 'editing'
let isDisabled = false

console.log('formState: ',formState);

return (
      <div className='w-100 h-100 d-flex flex-column'>
      {/* toolbar */}
      {visible && (
        <Window title={ t('Suppliers')} onClose={toggleDialog} initialWidth={900} initialHeight={500}>
          <PageContainer>
            <SupplierList />
        </PageContainer>
        </Window>
      )}


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
                  <Button primary={true} type='submit' form='myFormx' togglable={false} className='w-80px'>
                      { t('Save')}
                  </Button>
                  <Button primary={false} togglable={false} className='w-80px' onClick={onCancelClicked}>
                      { t('Cancel')}
                  </Button>
              </>
           )} 
      </div>
      <div className='container-fluid pb-10 pt-10 w-100' style={{ height: "calc(100% - 60px)", overflowY: 'auto' }}>
          <form id='myFormx' onSubmit={onSubmit}>
              {/* error message */}
              <div></div>
              <div className='k-form k-form-horizontal w-600px'>
                
                <fieldset className="k-form-fieldset">
                      <div className='k-form-field'>
                        <Label >{ t('SupplierCode') }</Label>
                      <span className='k-textbox k-grid-search k-display-flex w-250px'>
                        <input
                            id='searchText'
                            // value={searchText || ''}
                            autoComplete='off'
                            className='k-input'
                            // onChange={handleChange}
                            // onKeyPress={handleKeypress}
                        />
                      
                        <span className='k-input-icon pe-auto'>
                            <a className='fa fa-search' onClick={toggleDialog}  href='#'></a>
                        </span>
                    </span>
                    </div>

                    {/* <MultiColumnComboBox
                        data={data}
                        columns={columns}
                        textField={'customer_name'}
                        dataItemKey='customer_id'
                        value={value}
                        filterable={true}
                        onFilterChange={handleFilterChange}
                        loading={loading}
                        className='w-350px'
                        onChange={handleChange}
                    /> */}

                      <HookFormInput
                          name='supplier_name'
                          control={control}
                          label={ t('SupplierName')}
                          disabled={isDisabled}
                      />
                      {/* <HookFormInput
                      name="po_date"
                      control={control} 
                      label={ t('poDate')}
                      disabled={isDisabled}
                      /> */}
                       <HookFormInput
                      name="ref_number"
                      control={control} 
                      label={ t('refNumber')}
                      disabled={isDisabled}
                      />
                      <HookFormComboBoxWithRemoteData
                        name='payment_terms_id'
                        control={control}
                        label={t('PaymentTermsId')}
                        dataUrl='api/PaymentTerms/list'
                        disabled={isDisabled}
                    />
                     <HookFormDatePicker
                            name='purchaseDate'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('PurchaseDate')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
                         <HookFormDatePicker
                            name='deliveryDate'
                            control={control}
                            //defaultValue={initialFormData.userName}
                            label={t('DeliveryDate')}
                        //rules={{ required: t('DataIsRequired', { data: t('UserName') }) }}
                        />
            </fieldset>
      
              </div>

              
          </form>
      </div>
  </div>

    
        
        

    )
}