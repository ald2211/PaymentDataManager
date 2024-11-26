import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <button
      className="absolute top-[100px] left-10 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
      disabled={isSubmitting}
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft size={20} />
    </button>
  );
};

export default BackButton;
