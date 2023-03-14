import { sampleProducts } from "./sample-products";

// let data = [...sampleProducts];
let data: any[] = [];

const generateId = (data: any[]) =>
    data.reduce((acc, current) => Math.max(acc, current.ProductID), 0) + 1;

export const insertItem = (item: any) => {
    item.ProductID = generateId(data);
    item.inEdit = false;
    data.unshift(item);
    return data;
};

export const getItems = () => {
    return data;
};

export const updateItem = (item: any) => {
    let index = data.findIndex(record => record.ProductID === item.ProductID);
    data[index] = item;
    return data;
};

export const deleteItem = (item: any ) => {
    let index = data.findIndex(record => record.ProductID === item.ProductID);
    data.splice(index, 1);
    return data;
};
