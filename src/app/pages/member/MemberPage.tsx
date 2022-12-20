import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { ContentContainer } from "../../layout/components/ContentContainer";
import { PageContainer } from "../../layout/components/PageContainer";
import { PageTitle } from '../../../_metronic/layout/core'
import { Toolbar } from "../../layout/components/Toolbar";
import { useEffect, useState } from "react";
import { Member } from "../../interfaces/Member";
import { MemberHeader } from "./MemberHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../setup";
import { loadData, dataLoading, newData } from "./MemberSlice";
import { Route, Switch } from "react-router-dom";
import { Skeleton } from "@progress/kendo-react-indicators";
import { Button } from "@progress/kendo-react-buttons";
import { MemberInformation } from "./information/MemberInformation";
import { MemberContract } from "./contract/MemberContract";
import { MemberVehicle } from "./vehicle/MemberVehicle";
import { MemberInvoice } from "./invoice/MemberInvoice";
import { MemberStatusPill } from "../../shared/components/MemberStatusPill";
import { MemberContractList } from "./contract/MemberContractList";

export type MemberPageParams = {
    id: string
}

export function MemberPage() {
    const { t } = useTranslation('translation')
    const params: MemberPageParams = useParams();
    const dispatch = useDispatch()
    const memberState = useSelector((state: RootState) => state.member);
    const [state, setState] = useState<string>('init')

    console.log('params.id.toUpperCase()->',params.id.toUpperCase() );

    useEffect(() => {
        if (params.id.toUpperCase() === 'REGISTER') {
            dispatch(newData(null))
        }
        else {
            dispatch(dataLoading(null))
            dispatch(loadData(params.id))
        }
    }, [params.id])

    const memberPageLink = {
        title: 'Member',
        path: '/member',
        isActive: true,
    }

    console.log('params =', params)

    const toolbar = (
        <></>
    )

    {/*
        <>
            <Button primary={true} togglable={false} className='ms-1'>
                {t('Activate')}
            </Button>
            <Button primary={false} togglable={false} className='ms-1'>
                {t('Deactivate')}
            </Button>
            <Button primary={false} togglable={false} className='ms-1'>
                {t('Suspend')}
            </Button>
        </>
        */}

    function pageTitle() {
        if (memberState.state === 'loading') return '';
        else if (memberState.state === 'loaded') return memberState.data?.member_name;
        else if (memberState.state === 'new') return 'REGISTRATION'
        else return '';
    }

    function titleBadge() {
        if (memberState.state === 'new') {
            return null;
        }
        else {
            return (
                <>
                    <MemberStatusPill status={memberState.data?.member_status_id} />
                    {
                        memberState.data?.member_status_id === 2 && memberState.data?.should_be_suspended === true && (
                            <span className="badge rounded-pill bg-warning ms-1">Suspension Warning 15-12-2021</span>
                        )
                    }
                </>
            )
        }
    }


    var contentHeight = 'calc(100% - 55px)';
    if (memberState.state === 'new') {
        contentHeight = 'calc(100%)';
    }
    return (
        <div className='h-100 w-100 d-flex flex-column'>
            <PageTitle breadcrumbs={[{
                title: t('Member'),
                path: '/member',
                isActive: true,
                isSeparator: false
            }]} description='Active' >
                {pageTitle()}
            </PageTitle>
            <Toolbar toolbar={toolbar} titleBadge={titleBadge()}></Toolbar>
            {memberState.state !== 'new' && (
                <MemberHeader />
            )}
            <div style={{ height: contentHeight, overflowY: "auto" }}>
                <Switch>
                    <Route exact path={'/member/:id'}>
                        <MemberInformation />
                    </Route>
                    {memberState.state !== 'new' && (
                        <>
                            <Route exact path={'/member/:id/contract'}>
                                <MemberContractList />
                            </Route>
                            <Route exact path={'/member/:id/contract/:contractId'}>
                                <MemberContract />
                            </Route>
                            <Route path={'/member/:id/vehicle'}>
                                <MemberVehicle />
                            </Route>
                            <Route path={'/member/:id/invoice'}>
                                <MemberInvoice />
                            </Route>
                        </>
                    )}
                    <Redirect to={`/member/${params.id}`} />
                </Switch>
                {/* <ContentContainer>
                </ContentContainer> */}
            </div>
        </div>
    )
}