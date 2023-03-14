import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { PageTitle } from '../../../_metronic/layout/core'
import { Toolbar } from "../../layout/components/Toolbar";
import { useEffect, useState } from "react";
import { Purchase } from "../../interfaces/Purchases";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../setup";
import { loadData, dataLoading, newData } from "./PurchaseSlice";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { PurchaseForm } from "./PurchaseForm"

export type purchasePageParams = {
    id: string
}

export function PurchasePage() {
    const { t } = useTranslation('translation')
    const params: purchasePageParams = useParams();
    const dispatch = useDispatch()
    const purchaseState = useSelector((state: RootState) => state.purchase);
    const [state, setState] = useState<string>('init')
    const location = useLocation()
 
    // const params: { id: string } = useParams();

    useEffect(() => {
        if (params.id.toUpperCase() === 'NEW') {
            dispatch(newData(null))
        }
        else {
            dispatch(dataLoading(null))
            dispatch(loadData(params.id))
        }
    }, [params.id])

    

    console.log('params =', params)

    const toolbar = (
        <></>
    )

  

    function pageTitle() {
        if (purchaseState.state === 'loading') return '';
        else if (purchaseState.state === 'loaded') return purchaseState.data?.inventory_item_name;
        else if (purchaseState.state === 'new') return 'Add Purchase Order'
        else return '';
    }

    function titleBadge() {
        if (purchaseState.state === 'new') {
            return null;
        }
        else {
            return (
                <>
                </>
            )
        }
    }


    var contentHeight = 'calc(100% - 55px)';
    if (purchaseState.state === 'new') {
        contentHeight = 'calc(100%)';
    }
    return (
        <div className='h-100 w-100 d-flex flex-column'>
            <PageTitle breadcrumbs={[{
                title: t('Purchase'),
                path: '/purchase',
                isActive: true,
                isSeparator: false
            }]} description='Active' >
                {pageTitle()}
            </PageTitle>
            <Toolbar toolbar={toolbar} titleBadge={titleBadge()}></Toolbar>
       

          <div className='container-fluid d-flex flex-column bg-white pt-30 h-5px' style={{ borderBottomStyle: 'solid', borderBottomColor: '#eff2f5', borderBottomWidth: '1px' }}>
            <div className='w-100'>
                <div className='d-flex overflow-auto h-55px'>
                    <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                        <li className='nav-item'>
                            <Link
                                className={
                                    `nav-link text-active-primary me-6 ` +
                                    (location.pathname === `/purchase/` && 'active')
                                }
                                to={`/purchase/`}
                            >
                                {/* {('Tab-1')} */}
                            </Link>
                        </li>
                     
                       
                    </ul>
                </div>
            </div>
        </div>

        <div style={{ height: contentHeight, overflowY: "auto" }}>
                <Switch>
                        <>
                            {/* <Route exact path={'/purchase/new'}> */}
                            <Route exact path={'/purchase/:id'}>
                                <PurchaseForm />
                            </Route>
                        </>
                    <Redirect to={`/purchase/${params.id}`} />
                </Switch>
            </div>
            
        </div>
    )
}