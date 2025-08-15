import { Page, Locator, expect } from '@playwright/test';

export class PostCard {
  readonly page: Page;
  readonly root: Locator;
  readonly title: Locator;
  readonly content: Locator;
  readonly meta: Locator;
  readonly commentInput: Locator;
  readonly authorInput: Locator;
  readonly submitButton: Locator;
  readonly comments: Locator;
  readonly error: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
    this.title = root.getByTestId('post-title');
    this.content = root.getByTestId('post-content');
    this.meta = root.getByTestId('post-meta');
    this.commentInput = root.getByTestId('comment-input');
    this.authorInput = root.getByTestId('author-input');
    this.submitButton = root.getByTestId('submit-comment');
    this.comments = root.getByTestId('comment');
    this.error = root.getByTestId('comment-error');
  }

  async addComment(content: string, author?: string) {
    await this.commentInput.fill(content);
    if (author !== undefined) {
      await this.authorInput.fill(author);
    }
    await this.submitButton.click();
  }

  async expectCommentVisible(text: string) {
    await expect(this.comments.filter({ hasText: text })).toBeVisible();
  }

  async addAndAssert(content: string, author?: string) {
    await this.addComment(content, author);
    await this.expectCommentVisible(content);
  }

  async getCommentCount(text: string) {
    return await this.comments.filter({ hasText: text }).count();
  }
}
