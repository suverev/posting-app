import { useEffect, useState } from 'react';
import { getPosts, addComment } from '../mocks/api';
import type { Post } from '../types/models';
import { PostItem } from './PostItem';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPosts();
        if (mounted) setPosts(data);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAddComment(postId: number, content: string, author?: string) {
    const created = await addComment(postId, { content, author });
    // update local state to reflect new comment
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, created] } : p
      )
    );
  }

  if (loading) return <div className="container">Loading posts…</div>;
  if (error) return <div className="container error">Error: {error}</div>;

  return (
    <div className="container">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onAddComment={handleAddComment} />
      ))}
    </div>
  );
}
