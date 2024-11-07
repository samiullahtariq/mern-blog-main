import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Error from './pages/Error'
import Search from './pages/Search'
import About from './pages/About'
import LazyLoad from './components/LazyLoad';
import LSIKeywordGenerator from './components/LSIKeywordGenerator';
import KeywordExtractor from './components/KeywordExtractor'
import TipCalculator from './components/Tipcalculator';
import Tools from './pages/Tools';
import PPTXUpload from './components/PPTXUpload';
import PPTXUpdate from './components/PPTXUpdate';
import PostPptx from './pages/PostPptx';
import TemplateCard from './components/TemplateCard';
import WriteForUs from "./pages/WriteForUs";

const loadfooterComponent = () => import('./components/Footer');

export default function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/keyword-extractor' element={<KeywordExtractor />} />
        <Route path='/generate-keywords' element={<LSIKeywordGenerator />} />
        <Route path='/tip-calculator' element={<TipCalculator/>} />
        <Route path='/tools' element={<Tools/>} />
        <Route path='/theme' element={<TemplateCard/>} />
        <Route path='/write-for-us' element={<WriteForUs/>} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
          <Route path='/upload-pptx' element={<PPTXUpload />} />
          <Route path='/update-pptx/:pptxId' element={<PPTXUpdate />} />
        </Route>
        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path='/theme/:themeSlug' element={<PostPptx/>} />
        <Route path="*" element={<Error />} />
      </Routes>
      <LazyLoad loader={loadfooterComponent} fallback={<div>Loading Footer....</div>} />
    </BrowserRouter>
  );
}
