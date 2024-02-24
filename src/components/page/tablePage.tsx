import  { useState } from 'react'
import TableUi from '../ui/tableUi'
import { TableData } from '../../types/table';
import { Button, Flex, Spacer,  useDisclosure } from '@chakra-ui/react';
import './tablePage.css'
import BackdropUi from '../ui/backdropUi';
import { useAddItemIntoTableData, useDeleteItemFromTableData, useGetTableData } from '../../hooks/useSuperHeroesData';


export default function TablePage() {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(5)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [addItem, setAddItem] = useState<TableData>({
    id: Date.now().toString(),
    item: "",
    price: null,
    status: "",
    amountBuyers: null
  })
  const tableSubjectData = [
    'id',
    'item',
    'price',
    'status',
    'amountBuyers'
  ]

  const { isOpen, onOpen, onClose } = useDisclosure()



  const onSuccess = (data:TableData[] | undefined) => {
    console.log({ data })
  }

  const onError = (error: unknown) => {
    console.log({ error })
  }

  const { isLoading, data:rowDataTable, isError, error, refetch } = useGetTableData(
    onSuccess,
    onError,
    page,
    perPage,
  )
  
 
  const { mutate: addItemForTable } = useAddItemIntoTableData()
  const { mutate: deleteItemFromTable } = useDeleteItemFromTableData()

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (isError) {
    return <h2>{(error as Error)?.message}</h2>
  }

  const handleSave = async () => {
    try {
      addItemForTable(addItem)
      setAddItem({
        id: Date.now().toString(),
        item: "",
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
  
      <TableUi tableSubjectData={tableSubjectData} tableData={rowDataTable!} setSelectedRows={setSelectedRows} selectedRows={selectedRows} page={page} setPage={setPage} setPerPage={setPerPage} perPage={perPage}/>
      <BackdropUi onClose={onClose} isOpen={isOpen} updateAddItem={updateAddItem} handleSave={handleSave} />
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
