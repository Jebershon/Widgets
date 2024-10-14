import { useNavigate } from "react-router-dom";
import './style.css';
export default function Home(){
    const nav = useNavigate();
    return (
    <>
    <div className="Border">
       <div className="c1">
        <button onClick={()=>{nav('/NotHome')}} className="bt1">NewsHeadLines</button>
       </div>
       <div className="c2">
       <button onClick={()=>{nav('/BarHome')}} className="bt2">BarCode</button>
       </div>
    </div>
    </>
    );
}
