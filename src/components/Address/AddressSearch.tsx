import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";

interface AddressSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}
const AddressSearch = ({ isOpen, onClose, onComplete }: AddressSearchProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      className="modal-content relative h-[500px] max-w-lg"
    >
      <p className="text-xl font-bold">주소 검색</p>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-xl font-bold"
      >
        X
      </button>
      <DaumPostcode onComplete={onComplete} className="mt-5" />
    </Modal>
  );
};

export default AddressSearch;
