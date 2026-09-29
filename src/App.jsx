import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import AdminAppearance from './pages/admin/AdminAppearance.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminNews from './pages/admin/AdminNews.jsx'
import AdminServices from './pages/admin/AdminServices.jsx'
import AdminSlider from './pages/admin/AdminSlider.jsx'
import AdminTherapists from './pages/admin/AdminTherapists.jsx'
import Contact from './pages/Contact.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import NewsList from './pages/NewsList.jsx'
import Services from './pages/Services.jsx'
import TherapistProfile from './pages/TherapistProfile.jsx'
import Therapists from './pages/Therapists.jsx'

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'pemijat', element: <Therapists /> },
          { path: 'pemijat/:id', element: <TherapistProfile /> },
          { path: 'layanan', element: <Services /> },
          { path: 'berita', element: <NewsList /> },
          { path: 'berita/:id', element: <NewsDetail /> },
          { path: 'kontak', element: <Contact /> },
        ],
      },

      { path: '/admin/login', element: <AdminLogin /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'terapis', element: <AdminTherapists /> },
          { path: 'layanan', element: <AdminServices /> },
          { path: 'berita', element: <AdminNews /> },
          { path: 'slider', element: <AdminSlider /> },
          { path: 'penampilan', element: <AdminAppearance /> },
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}