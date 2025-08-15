import type { Post } from '../types/models';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';

export function PostItem({
  post,
  onAddComment,
}: {
  post: Post;
  onAddComment: (postId: number, content: string, author?: string) => Promise<void> | void;
}) {
  return (
    <article className="post-card" data-testid="post-card">
      <h2 className="post-title" data-testid="post-title">{post.title}</h2>
      <div className="post-meta" data-testid="post-meta">
        By {post.author} • {new Date(post.timestamp).toLocaleString()}
      </div>
      <p data-testid="post-content">{post.content}</p>

      <h3>Comments</h3>
      <CommentList comments={post.comments} />

      <CommentForm
        onSubmit={async (content, author) => {
          await onAddComment(post.id, content, author);
        }}
      />
    </article>
  );
}
