import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BlogContext = createContext();

export const useBlogContext = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlogContext must be used within a BlogProvider');
    }
    return context;
};

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [blogsRes, catsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/blogs?minimal=true`),
                axios.get(`${import.meta.env.VITE_API_URL}/categories`)
            ]);
            setBlogs(blogsRes.data);
            setCategories(catsRes.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching data in context:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const value = {
        blogs,
        categories,
        loading,
        error,
        refreshData: fetchData
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};
