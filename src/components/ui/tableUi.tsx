import { useState } from 'react';
import { Table, Tbody, Tr, Td, TableContainer, Thead, Th, Checkbox, Button } from '@chakra-ui/react';
import { TableData } from '../../types/table';

interface TableProps {
  tableData: TableData[];
  selectedRows:number[]
  setSelectedRows:React.Dispatch<React.SetStateAction<number[]>>;
}

const TableUi = ({ tableData , selectedRows, setSelectedRows}: TableProps) => {
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allIds = tableData.map((item) => item.id);
      setSelectedRows(allIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectRow = (id: number) => {
    const updatedSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
  
    setSelectedRows(updatedSelectedRows);

    const allRowsSelected = tableData.every((item) => updatedSelectedRows.includes(item.id));
    setSelectAll(allRowsSelected);
  };



  return (
    <TableContainer borderTopEndRadius={15} borderBottomEndRadius={15} >
      <Table variant="striped" >
        <Thead >
          <Tr bg={'#3182ce'} >
            <Th>
              <Checkbox isChecked={selectAll} onChange={toggleSelectAll} />
            </Th>
            <Th textColor={'aliceblue'}>ID</Th>
            <Th textColor={'aliceblue'}>Item</Th>
            <Th textColor={'aliceblue'}>Price</Th>
            <Th textColor={'aliceblue'}>Status</Th>
            <Th textColor={'aliceblue'}> Amount of buyers</Th>
           
          </Tr>
        </Thead>
        <Tbody>
          {tableData?.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Checkbox isChecked={selectedRows.includes(item.id)} onChange={() => toggleSelectRow(item.id)} />
              </Td>
              <Td>{item.id}</Td>
              <Td>{item.item}</Td>
              <Td>{item.price}</Td>
              <Td>{item.status}</Td>
              <Td>{item.amountBuyers}</Td>
              
            </Tr>
          ))}
        </Tbody>
      </Table>
      
    </TableContainer>
  );
};

export default TableUi;
