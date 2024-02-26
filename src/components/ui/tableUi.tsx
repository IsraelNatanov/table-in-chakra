import { useState } from 'react';
import { Table, Tbody, Tr, Td, TableContainer, Thead, Th, Checkbox, Select, Flex, Tooltip, IconButton } from '@chakra-ui/react';
import { DataFromApi } from '../../types/table';
import {
  ChevronRightIcon,
  ChevronLeftIcon
} from "@chakra-ui/icons";
interface TableProps {
  tableSubjectData: string[]
  tableData: DataFromApi;
  selectedRows: string[]
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  perPage:number
  isPreviousData:boolean
}

const TableUi = ({ tableSubjectData, tableData, selectedRows, setSelectedRows, page, setPage, setPerPage, perPage, isPreviousData }: TableProps) => {
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allIds = tableData.data.map((item) => item.id!);
      setSelectedRows(allIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectRow = (id: string) => {
    const updatedSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(updatedSelectedRows);

    const allRowsSelected = tableData.data.every((item) => updatedSelectedRows.includes(item.id!));
    setSelectAll(allRowsSelected);
  };
 

  return (
    <TableContainer borderTopEndRadius={15} borderBottomEndRadius={15} >
      <Table variant="striped"  >
        <Thead>
          <Tr bg={'#3182ce'}>
            <Th>
              <Checkbox isChecked={selectAll} onChange={toggleSelectAll} />
            </Th>
            {tableSubjectData.map((column, index) => (
              <Th key={index} textColor={'aliceblue'}>
                {column}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.data.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Checkbox isChecked={selectedRows.includes(item.id!)} onChange={() => toggleSelectRow(item.id!)} />
              </Td>
              <Td>{item.id}</Td>
              <Td>{item.nameItem}</Td>
              <Td>{item.price}</Td>
              <Td>{item.status}</Td>
              <Td>{item.amountBuyers}</Td>

            </Tr>
          ))}
        </Tbody>

      </Table>
      <Flex justifyContent={'flex-end'}>
        <Tooltip label="First Page">
          <IconButton
               isDisabled={isPreviousData||page === 1}
     
            onClick={() => page != 1 ? setPage(page => page - 1) : setPage(page)}
            icon={<ChevronLeftIcon h={6} w={6} />}
            aria-label={''} />
        </Tooltip>
        <Select
          width={'auto'}
value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>



        <Tooltip label="Next Page">
          <IconButton
               isDisabled={isPreviousData||tableData.pages === page}
            onClick={() => {
              setPage(page => page + 1)
          
            }
            }
         
            icon={<ChevronRightIcon h={6} w={6} />} aria-label={''} />
        </Tooltip>
      </Flex>

    </TableContainer>
  );
};

export default TableUi;
