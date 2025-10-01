import { useState, useCallback } from 'react';
import api from '../components/services/api';

export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getPosts();
            // Sort by most recent date
            const sortedPosts = data.results.sort(
                (a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)
            );
            setPosts(sortedPosts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPost = useCallback(async (postData) => {
        try {
            await api.createPost(postData);
            // Após criar, atualiza a lista
            await fetchPosts();
        } catch (err) {
            throw new Error(err.message);
        }
    }, [fetchPosts]);

   

    return {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,

    };
}; 