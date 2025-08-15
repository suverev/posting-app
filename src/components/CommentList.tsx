import type { Comment } from '../types/models';

export function CommentList({ comments }: { comments: Comment[] }) {
  if (!comments?.length) {
    return <div data-testid="no-comments" className="comment-meta">No comments yet</div>;
  }

  return (
    <div>
      {comments.map((c) => (
        <div key={c.id} className="comment" data-testid="comment">
          <div>{c.content}</div>
          <div className="comment-meta">By {c.author} • {new Date(c.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
