'use client';

import { useState, useEffect } from 'react';
import { ForumPost, ForumCategory, ForumComment } from '@/types/forum';
import { INITIAL_FORUM_DATA } from '@/lib/mock-forum-data';

export function useForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filter, setFilter] = useState<ForumCategory | 'Todo'>('Todo');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('citroforo_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(INITIAL_FORUM_DATA);
    }

    const savedBookmarks = localStorage.getItem('citroforo_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('citroforo_posts', JSON.stringify(posts));
    }
  }, [posts, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('citroforo_bookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  const addPost = (postData: any) => {
    const newPost: ForumPost = {
      id: Math.random().toString(36).substr(2, 9),
      ...postData,
      stats: { likes: 0, views: 0 },
      comments: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
  };

  const addComment = (postId: string, content: string, authorName: string, parentCommentId?: string) => {
    const newComment: ForumComment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: {
        name: authorName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
      },
      stats: { likes: 0 },
      replies: [],
      createdAt: new Date().toISOString(),
    };

    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id !== postId) return p;

      if (!parentCommentId) {
        return { ...p, comments: [...p.comments, newComment] };
      }

      // Recursive helper to add reply to nested comment
      const addReplyToNested = (comments: ForumComment[]): ForumComment[] => {
        return comments.map(c => {
          if (c.id === parentCommentId) {
            return { ...c, replies: [...(c.replies || []), newComment] };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: addReplyToNested(c.replies) };
          }
          return c;
        });
      };

      return { ...p, comments: addReplyToNested(p.comments) };
    }));
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, stats: { ...p.stats, likes: p.stats.likes + 1 } } : p
    ));
  };

  const toggleBookmark = (postId: string) => {
    setBookmarks(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const isPostBookmarked = (postId: string) => bookmarks.includes(postId);

  const toggleLikeComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const updateLikesNested = (comments: ForumComment[]): ForumComment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            return { ...c, stats: { ...c.stats, likes: (c.stats?.likes ?? 0) + 1 } };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateLikesNested(c.replies) };
          }
          return c;
        });
      };

      return { ...p, comments: updateLikesNested(p.comments) };
    }));
  };

  const updatePost = (postId: string, data: Partial<ForumPost>) => {
    setPosts(prev => {
      const updated = prev.map(p => 
        p.id === postId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      );
      return updated;
    });
  };

  const deletePost = (postId: string) => {
    setPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      return updated;
    });
    // Also remove from bookmarks if deleted
    setBookmarks(prev => prev.filter(id => id !== postId));
  };

  const filteredPosts = filter === 'Todo' 
    ? posts 
    : posts.filter(p => p.category === filter);

  return {
    posts: filteredPosts,
    allPosts: posts,
    bookmarks,
    filter,
    setFilter,
    addPost,
    addComment,
    updatePost,
    deletePost,
    toggleLikePost,
    toggleLikeComment,
    toggleBookmark,
    isPostBookmarked,
    isLoaded
  };
}
