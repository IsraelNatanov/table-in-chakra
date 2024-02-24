import { useQuery, useMutation, useQueryClient } from 'react-query';
import { request } from '../utils/axios-utils';
import { TableData } from '../types/table';

const fetchTableData = (_page: number, _per_page: number): Promise<TableData[]> => {
  return request({ url: '/items', params: { _page, _per_page } }).then(response => response.data.data);
};

export const useGetTableData = (onSuccess?: (data: TableData[]) => void, onError?: (error: unknown) => void, page: number = 1, perPage: number = 5) => {
  return useQuery<TableData[]>(['data-table', page, perPage], () => fetchTableData(page, perPage), { 
    onSuccess,
    onError,
  });
};

const addItemIntoTableData = (item: TableData): Promise<TableData> => {
  return request({ url: '/items', method: 'post', data: item }).then(response => response.data);
};

export const useAddItemIntoTableData = () => {
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
    onSettled: () => {
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

export const useDeleteItemFromTableData = () => {
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
    onSettled: () => {
      queryClient.invalidateQueries('data-table');
    }
    /**Optimistic Update End */
  });
};
