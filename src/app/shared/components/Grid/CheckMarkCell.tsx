import { faCheck } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GridCellProps } from "@progress/kendo-react-grid"
const CheckMarkCell = (props: GridCellProps) => {
    return props.field && props.dataItem[props.field] ? (
        <td>
            <div className='d-flex flex-row align-items-center justify-content-center'>
                <FontAwesomeIcon icon={faCheck} />
            </div>
        </td>
    ) : (
        <td>&nbsp;</td>
    )
}
export default CheckMarkCell