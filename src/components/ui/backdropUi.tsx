import { Button, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"

interface IProps {
  onClose: () => void;
  isOpen: boolean
  updateAddItem: (field: string, value: string) => void
  handleSave: () => void
}
const BackdropUi = ({ onClose, isOpen, updateAddItem, handleSave }: IProps) => {


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
          <form onSubmit={(e)=>e.preventDefault()}>
          <ModalHeader>Add Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup display={'flex'} flexDirection={'column'} rowGap={4}>

              <Input placeholder='Name item'
                onChange={(e) => updateAddItem('item', e.target.value)}
              />
              <Input type='number' placeholder='Price' onChange={(e) => updateAddItem('price', e.target.value)} />
              <Input placeholder='Status' onChange={(e) => updateAddItem('status', e.target.value)} />
              <Input placeholder='Amount of buyers' onChange={(e) => updateAddItem('amountBuyers', e.target.value)} />
            </InputGroup>


          </ModalBody>
          <ModalFooter justifyContent={"space-between"}>
          
            <Button colorScheme='blue' onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={handleSave}>Add an item</Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
export default BackdropUi