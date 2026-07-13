import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill(author)
  await page.getByRole('textbox', { name: 'url' }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`A new blog: ${title} by ${author} added`).waitFor()
  await expect(page).toHaveURL('/')
}

const likeBlog = async (page, title, author, expectedLikes) => {
  await page.getByRole('link', { name: `${title} by ${author}` }).click()  //open blog

  await page.getByRole('button', { name: 'like' }).click()
  await expect(page.getByText(`${expectedLikes} likes`)).toBeVisible() // wait for likes to be updated in the backend, for the response to arrive, and for the UI to re-render
  await page.goto('/')
}

export { loginWith, createBlog, likeBlog }