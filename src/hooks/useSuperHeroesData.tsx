import { useQuery, useMutation, useQueryClient } from 'react-query';
import { request } from '../utils/axios-utils';
import { DataFromApi, TableData } from '../types/table';
import { useToast } from '@chakra-ui/react';


const fetchTableData = (_page: number, _per_page: number): Promise<DataFromApi> => {
  return request({ url: '/items', params: { _page, _per_page } }).then(response => response.data);
};

export const useGetTableData = (onSuccess?: (data: DataFromApi) => void, onError?: (error: unknown) => void, page: number = 1, perPage: number = 5) => {
  return useQuery<DataFromApi>(['data-table', page, perPage], () => fetchTableData(page, perPage), { 
    onSuccess,
    onError,
    keepPreviousData: true,
  });
};

const addItemIntoTableData = (item: TableData): Promise<TableData> => {
  return request({ url: '/items', method: 'post', data: item }).then(response => response.data);
};

export const useAddItemIntoTableData = (toast: ReturnType<typeof useToast>) => {
  const queryClient = useQueryClient();
  
  return useMutation(addItemIntoTableData, {


    //Pessimistic UI Rendering
    /**Pessimistic Update Start */
    // onSuccess: (data: TableData) => {
    //   queryClient.setQueryData<TableData[]>('data-table', oldQueryData => {
    //     if (!oldQueryData) return []; 
    //     console.log(oldQueryData);
    //     return [...oldQueryData, data];
    //   });
    // },
    /**Pessimistic Update End */



    //Optimistic UI Rendering
    /**Optimistic Update Start */
    onMutate: async newItem => {
      await queryClient.cancelQueries('data-table');
      const previousDataTable = queryClient.getQueryData<TableData[]>('data-table');
      queryClient.setQueryData<TableData[]>('data-table', oldQueryData => {
        if (!oldQueryData) return [];
        console.log(oldQueryData);
        return [...oldQueryData, newItem];
      });
      return { previousDataTable }
    },

    onError: (_err, _newTodo, context) => {
      if (context?.previousDataTable) {
        queryClient.setQueryData('data-table', context.previousDataTable);
      }
     
    },
    onSettled: (_, error, __) => {
      if (!error) {
        toast({
          title: "Operation successful",
          status: "success",
          duration: 3000, 
          isClosable: true,
        });
      } else {
        toast({
          title: "Operation failed",
          status: "error",
          duration: 3000, 
          isClosable: true,
        });
      }
      queryClient.invalidateQueries('data-table');
    }
    /**Optimistic Update End */

  });
 

  
};




const deleteItemFromTableData = async (idItem: string): Promise<TableData> => {
  const response = await request({ url: `/items/${idItem}`, method: 'delete' });
   // for Optimistic UI Rendering 
   return response.data;
   //for Pessimistic UI return idItem
};

export const useDeleteItemFromTableData = (toast: ReturnType<typeof useToast>) => {
  const queryClient = useQueryClient();

  return useMutation(deleteItemFromTableData, {

        //Pessimistic UI Rendering
    /**Pessimistic Update Start */
    // onSuccess: async (idItem:string) => {
    //   queryClient.setQueryData<TableData[]>('data-table', oldQueryData => {
    //     const updatedData = oldQueryData?.filter(item => item.id !== idItem);
    //     return updatedData || [];
    //   });
    // }
  /**Pessimistic Update End */


    // Optimistic UI Rendering
     /**Optimistic Update Start */
    onMutate: async idItem => {
    
      await queryClient.cancelQueries('data-table');
      const previousDataTable = queryClient.getQueryData<TableData[]>('data-table');
      queryClient.setQueryData<TableData[]>('data-table', oldQueryData => {
        const updatedData = oldQueryData?.filter(item => item.id !== idItem);
        return updatedData || []; // return an empty array if data is null/undefined
      });

      return { previousDataTable };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousDataTable) {
        queryClient.setQueryData('data-table', context.previousDataTable);
      }
    },
    onSettled: (_, error, __) => {
      if (!error) {
        toast({
          title: "Operation successful",
          status: "success",
          duration: 3000, 
          isClosable: true,
        });
      } else {
        toast({
          title: "Operation failed",
          status: "error",
          duration: 3000, 
          isClosable: true,
        });
      }
      queryClient.invalidateQueries('data-table');
    }
    /**Optimistic Update End */
  });
};
