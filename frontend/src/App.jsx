import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import ChatbotWidget from "./components/ChatbotWidget";

import Home from "./pages/Home";

import Gstr3bSimplified from "./pages/Gstr3bSimplified";
import SearchGSTIN from "./pages/searchTaxpayer/SearchGSTIN";
import SearchPAN from "./pages/searchTaxpayer/SearchPAN";
import SearchTemporaryID from "./pages/searchTaxpayer/SearchTemporaryID";
import SearchComposition from "./pages/searchTaxpayer/SearchComposition";
import GstLaw from "./pages/GSTLaw";
import HelpTaxpayerFacilities from "./pages/HelpTaxPayerFacilities";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Footer from "./components/Footer";
import Registration from "./pages/register/Registration";
import TrackApplicationStatus from "./pages/register/TrackApplicationStatus";
import HomeStateGSK from "./pages/register/HomeStategGSK";
import VerifyRFN from "./pages/userServices/VerifyRFN";
import HolidayList from "./pages/userServices/HolidayList";
import CauseList from "./pages/userServices/CauseList";
import LocateGSTP from "./pages/userServices/LocateGSTP";
import GenerateUserID from "./pages/userServices/GenerateUserID";
import SearchHSNCode from "./pages/userServices/SearchHSNCode";
import CreateChallan from "./pages/payments/CreateChallan";
import TrackPaymentStatus from "./pages/payments/TrackPaymentStatus";
import PaymentGrievance from "./pages/payments/PaymentGrievance";
import EWayBill from "./pages/EWayBill";

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
        path: "/gstr3b-simplified",
        element: <Gstr3bSimplified />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
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
        path: "/gst-law",
        element: <GstLaw />,
      },
      {
        path: "/help-taxpayer-facilities",
        element: <HelpTaxpayerFacilities />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/registration/track-status",
        element: <TrackApplicationStatus />,
      },
      {
        path: "/registration/home-state-gsk",
        element: <HomeStateGSK />,
      },
      {
        path: "/services/user-services/verify-rfn",
        element: <VerifyRFN />,
      },
      {
        path: "/services/user-services/search-hsn",
        element: <SearchHSNCode />,
      },
      {
        path: "/services/user-services/holiday-list",
        element: <HolidayList />,
      },
      {
        path: "/services/user-services/cause-list",
        element: <CauseList />,
      },
      {
        path: "/services/user-services/locate-gstp",
        element: <LocateGSTP />,
      },
      {
        path: "/services/user-services/generate-user-id",
        element: <GenerateUserID />,
      },
      {
        path: "/services/payments/create-challan",
        element: <CreateChallan />,
      },

      {
        path: "/services/payments/track-status",
        element: <TrackPaymentStatus />,
      },

      {
        path: "/services/payments/grievance",
        element: <PaymentGrievance />,
      },
      {
        path: "/refunds/track-application-status",
        element: <TrackApplicationStatus />,
      },
      {
        path: "/services/track-application-status",
        element: <TrackApplicationStatus />,
      },
      {
        path: "/services/eway-bill",
        element: <EWayBill />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const App = () => {
  return (
    <ToastProvider>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LanguageProvider>
    </ToastProvider>
  );
};

export default App;