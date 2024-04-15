import { useNavigate } from "react-router-dom";
import "./Smallphone.css";
function Smallphone(props) {
  const navigate = useNavigate();
  const { data, verified } = props;
  const handleClick = () => {
    navigate(`/phonepage`, { state: { phoneData: data, isverified: verified} });
  };
  return (
    <div className="smallphone-main-div" onClick={handleClick}>
      <h2 className="smallphone-name">
        {data.name} {verified ? "✅" : ""}
      </h2>
      <img className="smallphone-image" src={data.image} alt="" />
    </div>
  );
}

export default Smallphone;
