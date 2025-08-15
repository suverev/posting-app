import { initialPosts } from './data';
import type { Post, Comment } from '../types/models';

// In-memory store cloned from initial data
let posts: Post[] = JSON.parse(JSON.stringify(initialPosts));

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getPosts(): Promise<Post[]> {
  // Return deep copy to avoid external mutation
  return delay(JSON.parse(JSON.stringify(posts)));
}

export async function addComment(
  postId: number,
  input: { content: string; author?: string }
): Promise<Comment> {
  const content = (input.content ?? '').trim();
  const author = (input.author ?? '').trim() || 'Anonymous';
  if (!content) {
    return Promise.reject(new Error('Comment content cannot be empty'));
  }
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return Promise.reject(new Error('Post not found'));
  }
  const nextId = post.comments.length
    ? Math.max(...post.comments.map((c) => c.id)) + 1
    : 1;
  const newComment: Comment = {
    id: nextId,
    content,
    author,
    timestamp: new Date().toISOString(),
  };
  post.comments.push(newComment);
  return delay(JSON.parse(JSON.stringify(newComment)));
}

export function __resetData() {
  // For tests (unit) if needed; not used in E2E
  posts = JSON.parse(JSON.stringify(initialPosts));
}
