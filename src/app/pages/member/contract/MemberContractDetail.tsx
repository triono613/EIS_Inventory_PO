import { Button } from "@progress/kendo-react-buttons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";


export function MemberContractDetail() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const history = useHistory();

    return (
        <div className='w-100 h-100 d-flex flex-column'>
            {/* toolbar */}
            <div className='container-fluid h-60px d-flex flex-row align-items-center gap-2 flex-shrink-0 bg-white' style={{ borderBottomStyle: 'solid', borderBottomColor: '#eff2f5', borderBottomWidth: '1px' }}>
                Toolbar..
            </div>
            <div className='container-fluid pb-10 pt-10 w-100' style={{ height: "calc(100% - 60px)", overflowY: 'auto' }}>
                Form here..
            </div>
        </div>
    )
}