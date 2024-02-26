import  { useState } from 'react'
import TableUi from '../ui/tableUi'
import { DataFromApi, TableData } from '../../types/table';
import { Button, Flex, Spacer,  useDisclosure, useToast } from '@chakra-ui/react';
import './tablePage.css'
import BackdropUi from '../ui/backdropUi';
import { useAddItemIntoTableData, useDeleteItemFromTableData, useGetTableData } from '../../hooks/useSuperHeroesData';


export default function TablePage() {
  const toast = useToast()
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(5)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [addItem, setAddItem] = useState<TableData>({
    id: Date.now().toString(),
    nameItem: "",
    price: null,
    status: "",
    amountBuyers: null
  })
  const tableSubjectData = [
    'id',
    'nameItem',
    'price',
    'status',
    'amountBuyers'
  ]


  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSuccess = (data:DataFromApi | undefined) => {
    console.log({ data })
  }

  const onError = (error: unknown) => {
     console.log({ error })
  }

  const { isLoading, data:rowDataTable, isError, error, isPreviousData } = useGetTableData(
    onSuccess,
    onError,
    page,
    perPage,
    
  )
  
  const {mutate: addItemIntoTableData} = useAddItemIntoTableData(toast);
  const { mutate: deleteItemFromTable } = useDeleteItemFromTableData(toast)

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (isError) {
    return <h2>{(error as Error)?.message}</h2>
  }


  const handleSave = async () => {
    try {
      addItemIntoTableData(addItem)
      setAddItem({
        id: Date.now().toString(),
        nameItem: "",
        price: null,
        status: "",
        amountBuyers: null,
      });

      onClose();
  
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateAddItem = (field: string, value: string | number | null) => {

    setAddItem((prev) => ({ ...prev, [field]: value }));

  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedRows.map((id) =>  deleteItemFromTable(id)));
      setSelectedRows([])
    } catch (error) {
      throw (error)
    }
  };


  return (
    <div>
  
      <TableUi tableSubjectData={tableSubjectData} tableData={rowDataTable!} setSelectedRows={setSelectedRows} selectedRows={selectedRows} page={page} setPage={setPage} setPerPage={setPerPage} perPage={perPage} isPreviousData={isPreviousData}/>
      <BackdropUi onClose={onClose} isOpen={isOpen} updateAddItem={updateAddItem} handleSave={handleSave} addItem={addItem}/>
      <Flex margin={5}>
        {selectedRows.length > 0 && (
          <Button mt="2" backgroundColor="#3182ce" textColor={'white'} onClick={handleDeleteSelected} textAlign={'left'}>
            Delete Selected
          </Button>
        )}
        <Spacer />
        <Button mt="2" backgroundColor="#3182ce" textColor={'white'} onClick={onOpen} >
          Add item
        </Button>

      </Flex>
    </div>
  )
}
