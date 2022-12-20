import { generate_UUID } from "../../../classes/UUID";
import { ContractAccessory } from "../../../interfaces/ContractAccessory";

let data: Array<ContractAccessory> = [];

export const insertItem = (item: ContractAccessory) => {
    item.tempId = generate_UUID()
    item.inEdit = false;
    data.unshift(item);
    return data;
};

export const getItems = () => {
    return data;
};

export const updateItem = (item: ContractAccessory) => {
    let index = data.findIndex(record => record.tempId === item.tempId);
    data[index] = item;
    return data;
};

export const deleteItem = (item: ContractAccessory) => {
    let index = data.findIndex(record => record.tempId === item.tempId);
    data.splice(index, 1);
    return data;
};