import { Button, Wrap, useToast } from "@chakra-ui/react"

  type UseToastOptions = {
    statuses?: "error" | "info" | "warning" | "success" | "loading" | undefined;
  };
  

const ToastStatus=({statuses}:UseToastOptions) =>{
  const toast = useToast()

  return (
    <Wrap>
  
 
          <Button
            onClick={() =>
              toast({
                title: `${statuses} toast`,
                status: 'error',
                isClosable: true,
              })
            }
          >
            Show {status} toast
          </Button>
  
     
    </Wrap>
  )
}
export default ToastStatus