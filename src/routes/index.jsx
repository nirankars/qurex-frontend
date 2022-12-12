import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import Register from "../pages/Register";
import Login from "../pages/Login";
import TreatmentPage from "../pages/TreatmentPage";
import DiscoverPage from "../pages/DiscoverPage";
import Doctor from "../pages/DoctorCmp";
import Consult from "../components/Consult";
import Confirm from "../components/Confirm";
import Home from "../components/Home";
import NoPage from "../pages/404";

import DashboardLayout from "../pages/Layout";
import {
  DoctorVerification,
  AiTestHelpers,
  AiTests,
  Prescription,
  ManualRefund,
  BookingList,
  TotalBooking,
  DoctorPayments,
  Cities,
  Specialization,
  SystemOfMedicine,
  Treatments,
  TreatmentCategories,
  CustomerJourney,
  Leads,
  MarketingPages,
  SEO,
  Tickets,
  Modules,
  Roles,
  Users,
  ManageUser,
  ManageDurationFee,
} from "../pages/Admin";
import {
  BusinessDashboard,
  PractiseDashboard,
  Appointment,
  Consultation,
  Availability,
  Profile,
  UpdateProfile,
  Ticket,
} from "../pages/Doctor";
import UserProfile from "../pages/User/Profile";
import UserBooking from "../pages/User/Booking";
import FrontLayout from "../pages/FrontLayout";
import Dashboard from "../pages/Admin/Dashboard";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import AgoraVideoCall from "../pages/AgoraVideoCall";
import DoctorsList from "../components/DoctorsList";
const AppRouter = () => {
  const auth = useSelector((state) => state.auth.authData.isAuthenticated);
  return (
    <Routes>
      <Route path="/" element={<FrontLayout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="treatment" element={<TreatmentPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="doctorsList" element={<DoctorsList />} />
        <Route path="doctor/:id" element={<Doctor />} />
        <Route
          path="booking-calendar/:id"
          element={!auth ? <Navigate to="/login" /> : <Consult />}
        />
        <Route
          path="confirm-payment"
          element={!auth ? <Navigate to="/login" /> : <Confirm />}
        />
        <Route
          path="video-call"
          element={!auth ? <Navigate to="/login" /> : <AgoraVideoCall />}
        />
        <Route path="*" element={<NoPage />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* ADMIN ROUTES */}
        <Route index element={<Dashboard />} />
        <Route path="doctor-verification" element={<DoctorVerification />} />
        <Route path="specializations" element={<Specialization />} />
        <Route path="treatment" element={<Treatments />} />
        <Route path="treatment-categories" element={<TreatmentCategories />} />
        <Route path="system-of-medicine" element={<SystemOfMedicine />} />
        <Route path="cities" element={<Cities />} />
        <Route path="sub-roles" element={<Roles />} />
        <Route path="modules" element={<Modules />} />
        <Route path="user-lists" element={<Users />} />
        <Route path="manage-user/:id" element={<ManageUser />} />
        <Route
          path="duration-and-fee-settings/:id"
          element={<ManageDurationFee />}
        />
        <Route path="ai-test-create" element={<AiTests />} />
        <Route path="ai-test-helpers" element={<AiTestHelpers />} />
        <Route path="generate-prescription" element={<Prescription />} />
        <Route path="manual-refund" element={<ManualRefund />} />
        <Route path="booking-list" element={<BookingList />} />
        <Route path="total-booking" element={<TotalBooking />} />
        <Route path="doctor-payments" element={<DoctorPayments />} />
        <Route path="marketing-pages" element={<MarketingPages />} />
        <Route path="leads" element={<Leads />} />
        <Route path="seo" element={<SEO />} />
        <Route path="logs" element={<CustomerJourney />} />
        <Route path="tickets" element={<Tickets />} />
        {/* DOCTOR ROUTES */}
        <Route path="business-dashboard" element={<BusinessDashboard />} />
        <Route path="practise-dashboard" element={<PractiseDashboard />} />
        <Route path="profile-view" element={<Profile />} />
        <Route path="profile-update" element={<UpdateProfile />} />
        <Route path="availability" element={<Availability />} />
        <Route path="appointments" element={<Appointment />} />
        <Route path="consultation-history" element={<Consultation />} />
        <Route path="tickets" element={<Ticket />} />
        {/* USER ROUTES */}
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="my-bookings" element={<UserBooking />} />

        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
