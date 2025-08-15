export type Comment = {
  id: number;
  content: string;
  author: string;
  timestamp: string; // ISO string
};

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string; // ISO string
  comments: Comment[];
};
