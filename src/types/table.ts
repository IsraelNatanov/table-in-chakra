export type TableData={
    id?: string,
    nameItem:string,
    price:number| null,
    status:string,
    amountBuyers:number|null,
}


export type DataFromApi={
    data:TableData[],
    first: number ,
    items: number ,
    last: number ,
    next: number ,
    pages: number ,
    
}
