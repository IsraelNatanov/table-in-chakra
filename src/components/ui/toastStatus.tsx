import { Button, Wrap, useToast } from "@chakra-ui/react"

  type UseToastOptions = {
    statuses?: "error" | "info" | "warning" | "success" | "loading" | undefined;
  };
  

const ToastStatus=({statuses}:UseToastOptions) =>{
  const toast = useToast()

  return (
   
              toast({
                title: `${statuses} toast`,
                status: statuses,
                isClosable: true,
              })
            
  )
}
export default ToastStatus