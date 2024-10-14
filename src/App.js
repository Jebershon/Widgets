import BarHome from './Components/Barcode/Home';
import { Route, Router, Routes } from 'react-router-dom';
import NewsHome from './Components/NewsHeadLines/Home';
import Home from './Components/Home';
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/NotHome' element={<NewsHome/>}></Route>
        <Route path='/BarHome' element={<BarHome/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
