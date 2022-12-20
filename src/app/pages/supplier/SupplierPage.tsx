import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { ContentContainer } from "../../layout/components/ContentContainer";
import { PageContainer } from "../../layout/components/PageContainer";
import { PageTitle } from '../../../_metronic/layout/core'
import { Toolbar } from "../../layout/components/Toolbar";
import { useEffect, useState } from "react";
import { Supplier } from "../../interfaces/Supplier";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../setup";
import { loadData, dataLoading, newData } from "./SupplierSlice";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { Skeleton } from "@progress/kendo-react-indicators";
import { Button } from "@progress/kendo-react-buttons";
import { MemberStatusPill } from "../../shared/components/MemberStatusPill";
import { SupplierForm } from "./tab-1/SupplierForm"

export type SupplierPageParams = {
    id: string
}

export function SupplierPage() {
    const { t } = useTranslation('translation')
    const params: SupplierPageParams = useParams();
    const dispatch = useDispatch()
    const supplierState = useSelector((state: RootState) => state.supplier);
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

    const supplierPageLink = {
        title: 'Supplier',
        path: '/supplier',
        isActive: true,
    }

    console.log('params =', params)

    const toolbar = (
        <></>
    )

  

    function pageTitle() {
        if (supplierState.state === 'loading') return '';
        else if (supplierState.state === 'loaded') return supplierState.data?.supplier_name;
        else if (supplierState.state === 'new') return 'Tambah Supplier'
        else return '';
    }

    function titleBadge() {
        if (supplierState.state === 'new') {
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
    if (supplierState.state === 'new') {
        contentHeight = 'calc(100%)';
    }
    return (
        <div className='h-100 w-100 d-flex flex-column'>
            <PageTitle breadcrumbs={[{
                title: t('Suppliers'),
                path: '/supplier',
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
                                    (location.pathname === `/supplier/tab-1` && 'active')
                                }
                                to={`/supplier/tab-1`}
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
                            {/* <Route exact path={'/supplier/new'}> */}
                            <Route exact path={'/supplier/:id'}>
                                <SupplierForm />
                            </Route>
                        </>
                    <Redirect to={`/supplier/${params.id}`} />
                </Switch>
            </div>
            
        </div>
    )
}