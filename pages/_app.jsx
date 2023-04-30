import "../styles/globals.css";
// import type { AppProps } from 'next/app'
import { AuthProvider } from "../context/auth/AuthContext";
import Navbar from "../components/layout/Navbar/Navbar";
import { TeamsProvider } from "../context/TeamsContext";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import SidebarContainer from "../components/layout/Sidebar/SidebarContainer";
import MobileSidebar from "../components/layout/Sidebar/MobileSidebar";
import MobileNavbar from "../components/layout/Navbar/MobileNavbar";
import ProtectedComponent from "../components/ProtectedComponent";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* <NotificationsProvider> */}
      <TeamsProvider>
        {/* <div className='lg:w-9/12 xl:w-8/12 2xl:w-7/12 mx-auto'>
        <Navbar />
        <Component {...pageProps} />
      </div> */}
        <div className="h-screen fixed w-full bg-gray-700">
          <div className="hidden sm:block">
            <Navbar />
          </div>
          <div className=" grid grid-cols-12">
          <SidebarContainer />

            <div
              className="relative col-span-12 sm:col-span-9
              2xl:col-span-10 "
            >
              <Component {...pageProps} />
            </div>
          </div>
          <div className="sm:hidden absolute bottom-0 right-0 left-0 py-3 px-2 bg-gray-900">
            <ProtectedComponent>
              <MobileNavbar />
            </ProtectedComponent>
          </div>
        </div>
      </TeamsProvider>
      {/* </NotificationsProvider> */}
    </AuthProvider>
  );
}

export default MyApp;
