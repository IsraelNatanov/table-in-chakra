import React, { useEffect, useState } from 'react'
import TableUi from '../ui/tableUi'
import { TableData } from '../../types/table';
import axios from 'axios';
import { Button, Flex, Spacer, useDisclosure } from '@chakra-ui/react';
import './tablePage.css'
import BackdropUi from '../ui/backdropUi';


export default function TablePage() {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(5)
  const [lengthRowData, setLengthRowData] =useState<number>(0)
  const [tableData, setTableData] = useState<TableData[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [addItem, setAddItem] = useState<TableData>({

    id: 1,
    item: "",
    price: null,
    status: "",
    amountBuyers: null

  })
  const tableSubjectData = [ 'id',
    'item',
    'price',
    'status',
    'amountBuyers']
  const { isOpen, onOpen, onClose } = useDisclosure()

  const postApi = async () => {
    try {
      const res = await axios.post('http://localhost:3500/items',addItem);
      console.log(res.data);

    } catch (error) {
      throw error;
    }
  } 

  const handleSave = () => {
    
    setAddItem({
      id: lengthRowData+3,
      item: "",
      price: null,
      status: "",
      amountBuyers: null,
    });
    postApi()

    onClose();
  };

  const handleDeleteRow = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3500/items/${id}`);
      console.log(`Row with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  useEffect(() => {
    getApi()
  }, [page, perPage, selectedRows])

  const getApi = async () => {
    try {
      const res = await axios.get(`http://localhost:3500/items?_page=${page}&_per_page=${perPage}`);
      console.log(res.data.data.length);
      setTableData(res.data.data)

    } catch (error) {
      throw error;
    }
  }
  const getLengthRow = async () => {
    try {
      const res = await axios.get(`http://localhost:3500/items`);
      console.log(res);
      console.log(res.data.length);
      

      setLengthRowData(res.data.length)
    } catch (error) {
      throw error;
    }
  }

  const handleDeleteSelected = async () => {
    try {

      await Promise.all(selectedRows.map((id) => handleDeleteRow(id)));
      setSelectedRows([])
    } catch (error) {
      throw (error)
    }
  };

  const updateAddItem = (field: string, value: string | number | null) => {
    getLengthRow()
    setAddItem((prev) => ({ ...prev, [field]: value }));
    setAddItem((prev) => ({ ...prev, ['id']: lengthRowData+2 }));
  };

 

  
  return (
    <div><TableUi tableSubjectData={tableSubjectData} tableData={tableData} setSelectedRows={setSelectedRows} selectedRows={selectedRows} page={page} setPage={setPage} setPerPage={setPerPage}/>
        <BackdropUi onClose={onClose} isOpen={isOpen} updateAddItem={updateAddItem} handleSave={handleSave} />
   <Flex margin={5}>
    {selectedRows.length > 0 && (
        <Button mt="2" backgroundColor="#3182ce" textColor={'white'} onClick={handleDeleteSelected} textAlign={'left'}>
          Delete Selected
        </Button>

      )}
    <Spacer />
    <Button mt="2" backgroundColor="#3182ce" textColor={'white'}   onClick={onOpen} >
        Add item
      </Button>
     
      </Flex>
    </div>
  )
}
