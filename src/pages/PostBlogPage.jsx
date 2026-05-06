import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { FaCloudUploadAlt, FaTimes, FaImage, FaHeading, FaTags, FaUser, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { SlArrowDown } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import Cropper from 'react-easy-crop';


const PostBlogPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [images, setImages] = useState({
    titleImage: null,
    blogImage1: null,
    blogImage2: null,
  });
  const [previews, setPreviews] = useState({
    titleImage: null,
    blogImage1: null,
    blogImage2: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]); // Dynamic categories
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  // Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropType, setCropType] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        // Skip cropping for videos
        if (type === 'authorAvatar') {
          setAuthorAvatar(file);
          setAvatarPreview(URL.createObjectURL(file));
        } else {
          setImages((prev) => ({ ...prev, [type]: file }));
          setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
        }
      } else {
        // Open cropper for images
        setCropImage(URL.createObjectURL(file));
        setCropType(type);
        setShowCropper(true);
      }
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleSaveCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(croppedBlob);

      if (cropType === 'authorAvatar') {
        setAuthorAvatar(croppedFile);
        setAvatarPreview(previewUrl);
      } else {
        setImages((prev) => ({ ...prev, [cropType]: croppedFile }));
        setPreviews((prev) => ({ ...prev, [cropType]: previewUrl }));
      }
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const removeImage = (type) => {
    if (type === 'authorAvatar') {
      setAuthorAvatar(null);
      setAvatarPreview(null);
    } else {
      setImages((prev) => ({ ...prev, [type]: null }));
      setPreviews((prev) => ({ ...prev, [type]: null }));
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'blockquote', 'code-block',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    // Append author first so Multer can use it for dynamic folder creation
    formData.append('author', author);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    
    if (authorAvatar) formData.append('authorAvatar', authorAvatar);
    if (images.titleImage) formData.append('titleImage', images.titleImage);
    if (images.blogImage1) formData.append('blogImage1', images.blogImage1);
    if (images.blogImage2) formData.append('blogImage2', images.blogImage2);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/blogs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Success:', response.data);
      alert('Blog post published successfully!');
      // Reset form
      setTitle('');
      setCategory('');
      setAuthor('');
      setContent('');
      setTags([]);
      setTagInput('');
      setAuthorAvatar(null);
      setAvatarPreview(null);
      setImages({ titleImage: null, blogImage1: null, blogImage2: null });
      setPreviews({ titleImage: null, blogImage1: null, blogImage2: null });
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Failed to publish blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderMediaPreview = (type, previewUrl, isAvatar = false) => {
    const file = isAvatar ? authorAvatar : images[type];
    const isVideo = file && file.type.startsWith('video/');

    return (
      <div className={`relative w-full ${isAvatar ? 'w-32 h-32' : 'aspect-[4/3]'} rounded-3xl overflow-hidden shadow-md`}>
        {isVideo ? (
          <video src={previewUrl} className="w-full h-full object-cover" controls />
        ) : (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        )}
        <button
          type="button"
          onClick={() => removeImage(type)}
          className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors z-20"
        >
          <FaTimes />
        </button>
        {!isAvatar && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full z-10">
            <span className="text-[8px] text-white font-black uppercase tracking-widest">
              {type === 'titleImage' ? 'Title' : `Inline ${type.slice(-1)}`}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 py-12 px-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-black mb-2 tracking-tight">Create New Blog</h1>
              <p className="text-white/80 font-medium">Share your thoughts and stories with the world.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                  <FaHeading className="text-red-600" /> Post Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                  <FaTags className="text-red-600" /> Category
                </label>
                
                {/* Custom Searchable Dropdown */}
                <div className="relative">
                  <div 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 cursor-pointer flex justify-between items-center group focus-within:border-red-600 transition-all"
                  >
                    <span className={`font-medium ${category ? 'text-gray-900' : 'text-gray-400'}`}>
                      {category || 'Select Category'}
                    </span>
                    <SlArrowDown className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} size={12} />
                  </div>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-gray-100 rounded-3xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search categories..."
                            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-100"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-[250px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {categories
                          .filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
                          .map((cat) => (
                            <div 
                              key={cat._id}
                              onClick={() => {
                                setCategory(cat.name);
                                setIsCategoryOpen(false);
                                setCategorySearch('');
                              }}
                              className="px-6 py-3 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors font-medium text-gray-700"
                            >
                              {cat.name}
                            </div>
                          ))}

                        {categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                          <div className="px-6 py-8 text-center text-gray-400 text-sm">
                            No categories found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Tags Input */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                <FaTags className="text-red-600" /> Article Tags
              </label>
              <div className="bg-gray-50 border-2 border-gray-100 rounded-[32px] p-4 focus-within:border-red-600 transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 animate-in zoom-in duration-200">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-black transition-colors">
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a tag and press Enter or Comma..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-transparent border-none outline-none font-medium text-gray-700 px-2 py-2"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-4">Press Enter or Comma to add a tag</p>
            </div>

            {/* Author & Avatar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                  <FaUser className="text-red-600" /> Author Name
                </label>
                <input
                  type="text"
                  placeholder="Who is writing this?"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                  Author Avatar
                </label>
                <div className="flex items-center gap-6">
                  {!avatarPreview ? (
                    <label
                      htmlFor="authorAvatar"
                      className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-all"
                    >
                      <FaUser className="text-gray-300 text-xl" />
                      <input type="file" id="authorAvatar" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'authorAvatar')} />
                    </label>
                  ) : (
                    renderMediaPreview('authorAvatar', avatarPreview, true)
                  )}
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Upload Avatar <br /> (Optional)
                  </span>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                <FaImage className="text-red-600" /> Media Upload (Max 3 Images)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['titleImage', 'blogImage1', 'blogImage2'].map((type, index) => (
                  <div key={type} className="relative group">
                    <input
                      type="file"
                      id={type}
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={(e) => handleImageChange(e, type)}
                    />
                    {!previews[type] ? (
                      <label
                        htmlFor={type}
                        className="flex flex-col items-center justify-center w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer group-hover:border-red-400 group-hover:bg-red-50/50 transition-all"
                      >
                        <FaCloudUploadAlt className="text-3xl text-gray-300 group-hover:text-red-600 mb-2 transition-colors" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-red-600 transition-colors text-center px-4">
                          {index === 0 ? 'Title Media' : `Blog Media ${index}`}
                        </span>
                        <span className="text-[8px] text-gray-400 mt-1 uppercase">(Image/Video)</span>
                      </label>
                    ) : (
                      renderMediaPreview(type, previews[type])
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest ml-1">
                Content Writer
              </label>
              <div className="bg-gray-50 rounded-3xl overflow-hidden border-2 border-gray-100 focus-within:border-red-600 transition-all">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Tell your story here..."
                  className="bg-white"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-1'} text-white font-black py-6 rounded-2xl shadow-xl shadow-red-100 transition-all uppercase tracking-[4px] text-sm`}
              >
                {isSubmitting ? 'Publishing article...' : 'Publish Article Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-[40px] overflow-hidden shadow-2xl">
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={cropType === 'authorAvatar' ? 1 : 4/3}
              cropShape={cropType === 'authorAvatar' ? 'round' : 'rect'}
              showGrid={true}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md">
            <div className="flex items-center gap-4 w-full">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="flex-grow accent-red-600 h-1 rounded-full cursor-pointer"
              />
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowCropper(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <FaX /> Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <FaCheck /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for Quill to match the theme */}

      <style>{`
        .ql-container.ql-snow {
          border: none !important;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 2px solid #f3f4f6 !important;
          padding: 15px !important;
          background: #fafafa;
        }
        .ql-editor {
          min-height: 300px;
          padding: 30px !important;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
          font-weight: 500 !important;
          left: 30px !important;
        }

        /* Custom Scrollbar for Category Dropdown */
        .max-h-\[250px\]::-webkit-scrollbar {
          width: 6px;
        }
        .max-h-\[250px\]::-webkit-scrollbar-track {
          background: transparent;
        }
        .max-h-\[250px\]::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .max-h-\[250px\]::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default PostBlogPage;
