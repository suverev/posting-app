import { useState } from 'react';

export function CommentForm({
  onSubmit,
}: {
  onSubmit: (content: string, author?: string) => Promise<void> | void;
}) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError('Comment cannot be empty');
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onSubmit(trimmed, author.trim());
      setContent('');
      // keep author between submissions for convenience
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="add-comment-form">
      <div className="form-row">
        <input
          className="input"
          data-testid="comment-input"
          aria-label="Comment content"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
        />
        <input
          className="input"
          data-testid="author-input"
          aria-label="Author"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={pending}
        />
        <button className="button" data-testid="submit-comment" disabled={pending}>
          {pending ? 'Posting…' : 'Post'}
        </button>
      </div>
      {error && (
        <div className="error" role="alert" data-testid="comment-error">
          {error}
        </div>
      )}
    </form>
  );
}
