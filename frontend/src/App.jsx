import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import ChatbotWidget from "./components/ChatbotWidget";

import Home from "./pages/Home";

import SearchGSTIN from "./pages/searchTaxpayer/SearchGSTIN";
import SearchPAN from "./pages/searchTaxpayer/SearchPAN";
import SearchTemporaryID from "./pages/searchTaxpayer/SearchTemporaryID";
import SearchComposition from "./pages/searchTaxpayer/SearchComposition";
import GstLaw from "./pages/GSTLaw";
import HelpTaxpayerFacilities from "./pages/HelpTaxPayerFacilities";
import Footer from "./components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <PageTransition />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      {/* Floating Citizen Assistant Chatbot */}
      <ChatbotWidget />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/search-taxpayer/gstin",
        element: <SearchGSTIN />,
      },

      {
        path: "/search-taxpayer/pan",
        element: <SearchPAN />,
      },

      {
        path: "/search-taxpayer/temporary-id",
        element: <SearchTemporaryID />,
      },

      {
        path: "/search-taxpayer/composition",
        element: <SearchComposition />,
      },

      {
        path: "*",
        element: <Navigate to="/" replace />,
      },

      {
        path: "/gst-law",
        element: <GstLaw />,
      },

      {
        path: "/help-taxpayer-facilities",
        element: <HelpTaxpayerFacilities />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;