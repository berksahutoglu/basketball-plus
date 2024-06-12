import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

import LoginScreen from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EventPage from "./pages/EventPage";
import Settings from "./pages/Settings";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" index element={<LoginScreen />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
