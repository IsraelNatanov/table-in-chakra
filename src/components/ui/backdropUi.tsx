import { Button, FormControl, FormErrorMessage, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import { TableData } from "../../types/table";

interface IProps {
  onClose: () => void;
  isOpen: boolean
  updateAddItem: (field: string, value: string) => void
  handleSave: () => void
  addItem:TableData
}
const BackdropUi = ({ onClose, isOpen, updateAddItem, handleSave , addItem}: IProps) => {

  let {register , handleSubmit , formState: { errors } } = useForm()

  const actionForm = ()=>{
      
   handleSave()
  }

  return (
    <>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(actionForm)}>
          <ModalHeader>Add Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          <InputGroup display={'flex'} flexDirection={'column'} rowGap={4}>
  <FormControl isInvalid={!!errors.nameItem}>
    <Input placeholder='Name item' value={addItem.nameItem} {...register("nameItem", { required: 'Name item is required' })} onChange={(e) => updateAddItem('nameItem', e.target.value)} />
    {errors.nameItem && typeof errors.nameItem === 'string' && (
      <FormErrorMessage>{errors.nameItem}</FormErrorMessage>
    )}
  </FormControl>

  <FormControl isInvalid={!!errors.price}>
    <Input type='number' placeholder='Price' value={addItem.price!} {...register("price", { required: 'Price is required' })} onChange={(e) => updateAddItem('price', e.target.value)} />
    {errors.price && typeof errors.price === 'string' && (
      <FormErrorMessage>{errors.price}</FormErrorMessage>
    )}
  </FormControl>

  <FormControl isInvalid={!!errors.status}>
    <Input placeholder='Status' value={addItem.status} {...register("status", { required: 'Status is required' })} onChange={(e) => updateAddItem('status', e.target.value)} />
    {errors.status && typeof errors.status === 'string' && (
      <FormErrorMessage>{errors.status}</FormErrorMessage>
    )}
  </FormControl>

  <FormControl isInvalid={!!errors.amountBuyers}>
    <Input placeholder='Amount of buyers' value={addItem.amountBuyers!} {...register("amountBuyers", { required: 'Amount of buyers is required' })} onChange={(e) => updateAddItem('amountBuyers', e.target.value)} />
    {errors.amountBuyers && typeof errors.amountBuyers === 'string' && (
      <FormErrorMessage>{errors.amountBuyers}</FormErrorMessage>
    )}
  </FormControl>
</InputGroup>


          </ModalBody>
          <ModalFooter justifyContent={"space-between"}>
          
            <Button colorScheme='blue' onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='blue' type='submit' >Add an item</Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
export default BackdropUi