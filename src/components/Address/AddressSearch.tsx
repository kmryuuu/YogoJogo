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
      className="modal-content"
    >
      <div className="relative h-[500px] w-full max-w-md rounded-lg bg-white p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-6 text-xl font-bold"
        >
          X
        </button>
        <DaumPostcode onComplete={onComplete} className="mt-10" />
      </div>
    </Modal>
  );
};

export default AddressSearch;
