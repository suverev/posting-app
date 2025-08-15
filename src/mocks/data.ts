import type { Post } from '../types/models';

export const initialPosts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the content of the first post',
    author: 'John Doe',
    timestamp: '2024-01-15T10:30:00Z',
    comments: [
      {
        id: 1,
        content: 'Great post!',
        author: 'Jane Smith',
        timestamp: '2024-01-15T11:00:00Z',
      },
    ],
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'Welcome to the demo app.',
    author: 'Alice Johnson',
    timestamp: '2024-02-20T09:15:00Z',
    comments: [],
  },
];
