import { DropDownList, DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import { Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridToolbar } from "@progress/kendo-react-grid";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { generate_UUID } from "../../../classes/UUID";
import { ContractAccessory } from "../../../interfaces/ContractAccessory";
import { IdTextTuple } from "../../../interfaces/IdTextTuple";
import { DropDownListWithRemoteData } from "../../../shared/components/Dropdowns/DropDownListWithRemoteData";
import { deleteItem, getItems, insertItem, updateItem } from "./ContractAccessoriesService";

interface ContractAccessoriesGridProps {
    data: Array<ContractAccessory>,
    disabled: boolean,
    onChange: (data: Array<ContractAccessory>) => void
}

export function ContractAccessoriesGrid(props: ContractAccessoriesGridProps) {
    const { t } = useTranslation('translation')
    const [data, setData] = useState<Array<ContractAccessory>>([]);
    const editField = "inEdit";
    const [accessories, setAccessories] = useState<Array<IdTextTuple>>([])
    const [accessoriesLoaded, setAccessoriesLoaded] = useState<boolean>(false)

    useEffect(() => {
        loadAccessories()
    }, [])

    useEffect(() => {
        console.log('ContractAccessoriesGrid.UseEffect #2 called. props.data.length = ' + props.data.length)
        let newData = props.data.map((item) => {
            return { ...item, inEdit: !props.disabled, tempId: item.tempId ?? generate_UUID() }
        })
        setData(newData);
    }, [props.data, props.disabled])

    function loadAccessories() {
        console.log('loadAccessories()..')
        let url = `api/accessories/list`
        axios
            .get(url)
            .then((response) => {
                const data = response.data
                console.log('Data loaded. ', data)
                setAccessories(data)
                setAccessoriesLoaded(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const remove = (dataItem: ContractAccessory) => {
        console.log('Remove() dataItem = ', dataItem)
        const newData = [...data];
        let index = newData.findIndex(record => record.tempId === dataItem.tempId);
        newData.splice(index, 1);
        setData(newData);
        props.onChange(newData);
    };

    const add = (dataItem: ContractAccessory) => {
        dataItem.inEdit = true;

        const newData = insertItem(dataItem);
        setData(newData);
    };

    const update = (dataItem: ContractAccessory) => {
        dataItem.inEdit = false;
        const newData = updateItem(dataItem);
        setData(newData);
    };

    // Local state operations
    const discard = (dataItem: ContractAccessory) => {
        const newData = [...data];
        newData.splice(0, 1);
        setData(newData);
    };

    const cancel = (dataItem: ContractAccessory) => {
        const originalItem = getItems().find(
            (p) => p.tempId === dataItem.tempId
        );
        if (originalItem) {
            const newData = data.map((item) =>
                item.tempId === originalItem?.tempId ? originalItem : item
            );
            setData(newData);
        }
    };

    const enterEdit = (dataItem: ContractAccessory) => {
        let newData = data.map((item) =>
            item.tempId === dataItem.tempId ? { ...item, inEdit: true } : item
        );
        setData(newData);
    };

    const itemChange = (event: GridItemChangeEvent) => {
        const field = event.field || "";
        const newData = data.map((item) =>
            item.tempId === event.dataItem.tempId
                ? { ...item, [field]: event.value }
                : item
        );
        setData(newData);
        props.onChange(newData);
    };

    const addNew = () => {
        const newDataItem: ContractAccessory = {
            tempId: generate_UUID(),
            inEdit: true,
            id: 0,
            contract_id: 0,
            number: 0,
            accessories_id: 0,
            qty: 1,
            notes: '',
        };
        const newData = [...data, newDataItem]
        setData(newData);
        props.onChange(newData);
    };

    function accessoryCell(cellProps: GridCellProps) {
        const handleChange = (e: DropDownListChangeEvent) => {
            if (cellProps.onChange) {
                cellProps.onChange({
                    dataIndex: 0,
                    dataItem: cellProps.dataItem,
                    field: cellProps.field,
                    syntheticEvent: e.syntheticEvent,
                    value: e.target.value.id,
                });
            }
        };

        const { dataItem } = cellProps;
        const field = cellProps.field || "";
        const dataValue = dataItem[field] === null ? "" : dataItem[field];
        let accessoryText = "";
        let accessory = null;
        if (accessoriesLoaded) {
            accessory = accessories.find((c) => c.id === dataValue);
            if (accessory) accessoryText = accessory.text;
        }
        return (
            <td>
                {accessoriesLoaded && (
                    <>
                        {!props.disabled ? (
                            <DropDownList
                                onChange={handleChange}
                                value={accessory}
                                data={accessories}
                                textField="text"
                                disabled={props.disabled}
                            />
                        ) : (
                                <span>{ accessoryText }</span>
                            )}
                        </>
                )}
            </td>
        )
    }

    const CommandCell = (cellProps: GridCellProps) => {
        return (
            <td className='k-command-cell text-center'>
                <button
                    className="k-button k-grid-remove-command"
                    onClick={() => remove(cellProps.dataItem)}
                    disabled={props.disabled}
                >
                    {t('Remove')}
                </button>
            </td>
        )
    }

    console.log('ContractAccessoriesGrid redraw')

    return (
        <div>
            <Grid
                data={data}
                onItemChange={itemChange}
                editField={editField}
                dataItemKey={"tempId"}
            >
                <GridColumn field="accessories_id" cell={accessoryCell} title={t("Accessory")} width="200px" />
                <GridColumn field="qty" title={t('Quantity')} editor="numeric" width="100px" />
                <GridColumn field="notes" title={t('Notes')} />
                {!props.disabled && (
                    <GridColumn cell={CommandCell} width="100px" />
                )}
            </Grid>
            <div className='mt-2'>
                {!props.disabled && (
                    <button type='button' className="k-button" onClick={addNew} disabled={props.disabled}>
                        {t('AddData', { data: t('Accessory') })}
                    </button>
                )}
            </div>
        </div>
    );
}