import React, { useEffect, useState } from 'react'
import TableUi from '../ui/tableUi'
import { TableData } from '../../types/table';
import axios from 'axios';
import { Button, useDisclosure } from '@chakra-ui/react';
import './tablePage.css'
import BackdropUi from '../ui/backdropUi';


export default function TablePage() {
  const [tableData, setTableData] = useState<TableData[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [addItem, setAddItem] = useState<TableData>({

    id: tableData.length + 2,
    item: "",
    price: null,
    status: "",
    amountBuyers: null

  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    getApi()
  }, [])

  const getApi = async () => {
    try {
      const res = await axios.get('http://localhost:3500/items');
      console.log(res.data);
      setTableData(res.data)
    } catch (error) {
      throw error;
    }
  }

  const handleDeleteRow = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3500/items/${id}`);
      setTableData((prevData) => prevData.filter((item) => item.id !== id));
      console.log(`Row with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {

      await Promise.all(selectedRows.map((id) => handleDeleteRow(id)));
      setSelectedRows([])
    } catch (error) {
      throw (error)
    }
  };

  const updateAddItem = (field: string, value: string | number | null) => {
    setAddItem((prev) => ({ ...prev, [field]: value }));
    setAddItem((prev) => ({ ...prev, ['id']: tableData.length+1 }));
  };
  const handleSave = () => {
    setTableData((prevTableData) => [...prevTableData, addItem]);
    console.log(tableData);

    setAddItem({
      id: tableData.length+1, 
      item: "",
      price: null,
      status: "",
      amountBuyers: null,
    });
    postApi()

    onClose();
  };
  const postApi = async () => {
    try {
      const res = await axios.post('http://localhost:3500/items',addItem);
      console.log(res.data);

    } catch (error) {
      throw error;
    }
  }

  
  return (
    <div><TableUi tableData={tableData} setSelectedRows={setSelectedRows} selectedRows={selectedRows} />
        <BackdropUi onClose={onClose} isOpen={isOpen} updateAddItem={updateAddItem} handleSave={handleSave} />
        <div className='row-button'>
    {selectedRows.length > 0 && (
        <Button mt="2" backgroundColor="#3182ce" textColor={'white'} onClick={handleDeleteSelected}>
          Delete Selected
        </Button>

      )}
   <div className='button-add'> <Button mt="2" backgroundColor="#3182ce" textColor={'white'}   onClick={onOpen}  >
        Add item
      </Button>
      </div>
      </div>

    </div>
  )
}
