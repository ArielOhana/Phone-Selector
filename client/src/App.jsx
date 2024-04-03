import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Homepage from "./pages/Homepage/Homepage";
import "./App.css";
import { ContextProvider } from "./Context";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import SearchPage from "./pages/SearchPage/SearchPage";
import Phonepage from "./pages/PhoneDetails/Phonepage";
function App() {
  return (
    <>
    <ContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/phonepage" element={<Phonepage />} />
          <Route path="/searchpage" element={<SearchPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
    </ContextProvider>
    </>
  );
}

export default App;
