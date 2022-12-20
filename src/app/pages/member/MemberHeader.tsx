import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { RootState } from "../../../setup";

export function MemberHeader() {
    const { t } = useTranslation('translation')
    const location = useLocation()
    const memberState = useSelector((state: RootState) => state.member);
    const params: { id: string } = useParams();

    return (
        <div className='container-fluid d-flex flex-column bg-white pt-30 h-55px' style={{ borderBottomStyle: 'solid', borderBottomColor: '#eff2f5', borderBottomWidth: '1px' }}>
            {/* <div>
                Member Name 
            </div> */}
            <div className='w-100'>
                <div className='d-flex overflow-auto h-55px'>
                    <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                        <li className='nav-item'>
                            <Link
                                className={
                                    `nav-link text-active-primary me-6 ` +
                                    (location.pathname === `/member/${params.id}` && 'active')
                                }
                                to={`/member/${params.id}`}
                            >
                                {t('Overview')}
                            </Link>
                        </li>
                        {memberState.state !== 'new' && (
                            <li className='nav-item'>
                                <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname.startsWith(`/member/${params.id}/contract`) && 'active')
                                    }
                                    to={`/member/${params.id}/contract`}
                                >
                                    {t('Contracts')}
                                </Link>
                            </li>
                        )}
                        {memberState.state !== 'new' && (
                            <li className='nav-item'>
                                <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname.startsWith(`/member/${params.id}/vehicle`) && 'active')
                                    }
                                    to={`/member/${params.id}/vehicle`}
                                >
                                    {t('Vehicles')}
                                </Link>
                            </li>
                        )}
                        {memberState.state !== 'new' && (
                            <li className='nav-item'>
                                <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname.startsWith(`/member/${params.id}/invoice`) && 'active')
                                    }
                                    to={`/member/${params.id}/invoice`}
                                >
                                    {t('Invoices')}
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}