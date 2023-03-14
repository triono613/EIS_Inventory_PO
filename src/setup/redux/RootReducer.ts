import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux'

import * as auth from '../../app/modules/auth'
import AppDialogReducer from '../../app/shared/components/AppDialog/AppDialogSlice'
import LocationTypeReducer from '../../app/pages/location-type/LocationTypeSlice'
import { memberSlice } from '../../app/pages/member/MemberSlice'
import { memberContractSlice } from '../../app/pages/member/contract/MemberContractSlice'
import { supplierSlice } from '../../app/pages/supplier/SupplierSlice'
import { ProductSlice } from '../../app/pages/product/ProductSlice'
import { PurchaseSlice } from '../../app/pages/purchase/PurchaseSlice'
import { supplierReturnSlice } from '../../app/pages/supplier-return/SupplierReturnSlice'

export const rootReducer = combineReducers({
    auth: auth.reducer,
    member: memberSlice.reducer,
    memberContract: memberContractSlice.reducer,
    supplier : supplierSlice.reducer,
    product : ProductSlice.reducer,
    purchase : PurchaseSlice.reducer,
    appDialog: AppDialogReducer,
    locationType: LocationTypeReducer,
    supplierReturn: supplierReturnSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
    yield all([auth.saga()])
}
