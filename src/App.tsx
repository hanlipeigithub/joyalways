import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CooperationPage from '@/pages/CooperationPage'
import RndPage from '@/pages/RndPage'
import CareersPage from '@/pages/CareersPage'
import DigitalPage from '@/pages/DigitalPage'
import NewsPage from '@/pages/NewsPage'
import NewsDetailPage from '@/pages/NewsDetailPage'
import InvestorPage from '@/pages/InvestorPage'
import NoticesPage from '@/pages/NoticesPage'
import NoticeDetailPage from '@/pages/NoticeDetailPage'
import ContactPage from '@/pages/ContactPage'
import AdminPage from '@/pages/AdminPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cooperation" element={<CooperationPage />} />
          <Route path="/rnd" element={<RndPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/digital" element={<DigitalPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/investor" element={<InvestorPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  )
}
