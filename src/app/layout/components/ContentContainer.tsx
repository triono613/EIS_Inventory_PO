import React, {useMemo, useLayoutEffect, useEffect} from 'react'
//import {useHtmlClassService} from '../../../_metronic/layout/_core/MetronicLayout' //"../../_core/MetronicLayout"

const ContentContainer: React.FC = ({children}) => {
    return (
        <div className='h-100 content'>
            <div
                id='pageContentContainer'
                className={`container-fluid d-flex flex-column h-100 flex-column-fluid px-0`}
            >
                {children}
            </div>
        </div>
    )
}

export {ContentContainer}

// export function ContentContainer({children}) {
//     //const uiService = useHtmlClassService()
//     // Layout settings (cssClasses/cssAttributes)
//     // const layoutProps = useMemo(() => {
//     //     return {
//     //         contentContainerClasses: uiService.getClasses('content_container', true),
//     //     }
//     // }, [uiService])
//     return (
//         // <div id="pageContentContainer" className={`${layoutProps.contentContainerClasses} d-flex flex-column h-100 flex-column-fluid`}>
//         //     {props.children}
//         // </div>
//         <div
//             id='pageContentContainer'
//             className={`container-fluid d-flex flex-column h-100 flex-column-fluid`}
//         >
//             {children}
//         </div>
//     )
// }
