import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import NotifyBar from './components/NotifyBar'
import HomePage from './pages/HomePage'
import BlogDetailsPage from './pages/BlogDetailsPage'
import CategoryPage from './pages/CategoryPage'
import AuthorPage from './pages/AuthorPage'
import PostBlogPage from './pages/PostBlogPage'
import TagPage from './pages/TagPage'
import Footer from './components/Footer'

function App() {
  return (
    <Router basename="/projectblogs">
      <NotifyBar />
      <NavBar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:idOrSlug" element={<BlogDetailsPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/author/:name" element={<AuthorPage />} />

          <Route path="/post-blog" element={<PostBlogPage />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  )
}

export default App