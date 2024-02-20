import React, { useEffect, useState } from 'react'
import TableUi from '../ui/tableUi'
import { TableData } from '../../types/table';
import axios from 'axios';
import { Button, Flex, Skeleton, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import './tablePage.css'
import BackdropUi from '../ui/backdropUi';


export default function TablePage() {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(5)
  const [tableData, setTableData] = useState<TableData[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loadin, setLoadin] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [addItem, setAddItem] = useState<TableData>({
    id :Date.now(),
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

  useEffect(() => {
    getApi()
  }, [ page, perPage ])

  const getApi = async () => {
    try {
      const res = await axios.get(`http://localhost:3500/items?_page=${page}&_per_page=${perPage}`);
      console.log(res.data.data.length);
      setTableData(res.data.data)
      setLoadin(false)

    } catch (error) {
      setError(true)
      setLoadin(false)
      throw error;
    
    }
  }

  const postApi = async () => {
    setTableData([...tableData, addItem])
    try {
      const res = await axios.post('http://localhost:3500/items',addItem);
      console.log(res.data);

    } catch (error) {
      setTableData([...tableData])
      throw error;
    }
  } 

  const handleSave = () => {
    
    postApi()
    setAddItem({
      id:Date.now(),
      item: "",
      price: null,
      status: "",
      amountBuyers: null,
    });
    onClose();
  };

  const updateAddItem = (field: string, value: string | number | null) => {

    setAddItem((prev) => ({ ...prev, [field]: value }));

  }

  const handleDeleteRow = async (id: number) => {

    setTableData(tableData.filter(item=> item.id !== id))
console.log(id);

    await axios(`http://localhost:3500/items/${id}`,{
      method: 'DELETE'
    })
    .then(response=> {
      console.log(response);
      if(response.statusText !== 'OK'){
          throw new Error('faild to delete item')
          
      } 
      console.log(`Row with ID ${id} deleted successfully.`);
    } ).catch (error=> {
      setTableData([...tableData])
      console.error('Error deleting row:', error);
    })
  };

 

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedRows.map((id) => handleDeleteRow(id)));
      setSelectedRows([])
    } catch (error) {
      throw (error)
    }
  };
  

  return (
    <div> {loadin &&<> <Skeleton height='20px' /> <Text fontSize='5xl' textAlign={'center'}>Loading...</Text></>}
    {error && <Text fontSize='5xl' textAlign={'center'}>Error 404...</Text>}
      <TableUi tableSubjectData={tableSubjectData} tableData={tableData} setSelectedRows={setSelectedRows} selectedRows={selectedRows} page={page} setPage={setPage} setPerPage={setPerPage}/>
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
