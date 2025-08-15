import { faker } from '@faker-js/faker';

export const longText = (n = 1000) => 'x'.repeat(n);
export const emojiPayload = () => 'Emoji test 😄🚀🔥';
export const htmlPayload = () => '<b>bold</b><script>alert(1)</script>';

export const makeCommentText = () => faker.lorem.sentence();
export const makeAuthor = () => faker.person.firstName();

// Predefined titles that exist in mock data for easy reference in tests
export const POST_TITLES = {
  first: 'First Post',
  second: 'Second Post',
} as const;
