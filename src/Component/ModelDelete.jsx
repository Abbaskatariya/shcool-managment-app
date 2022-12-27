import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

const ModelDelete = ({ modal, setModal, deleted }) => {
    return <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>Delete Class</ModalHeader>
        <ModalBody>this record delete permanent</ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={deleted}>Delete Record</Button>
            <Button color="secondary" onClick={() => setModal(!modal)}>Cancel</Button>
        </ModalFooter>
    </Modal>
}
export default ModelDelete