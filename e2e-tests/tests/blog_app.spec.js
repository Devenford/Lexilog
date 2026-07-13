/* eslint-disable playwright/no-useless-not */
import { test, expect } from '@playwright/test'
import { loginWith, createBlog, likeBlog } from './helper'

const { describe, beforeEach } = test
const blog = {
  title: 'The Pragmatic Programmer',
  author: 'Andrew Hunt and David Thomas',
  url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'neil123',
        name: 'Neil Tyson',
        password: 'password12345'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'albert123',
        name: 'Albert Einstein',
        password: 'emc2gravity'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown in login page', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/login')
    })

    test('succeeds with the correct credentials', async ({ page }) => {
      await loginWith(page, 'neil123', 'password12345')

      await expect(page).toHaveURL('/') //redirected to home page on successful login
    })

    test('fails with the wrong credentials', async ({ page }) => {
      await loginWith(page, 'neil123', 'wrongpassword')

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/login')
      await loginWith(page, 'neil123', 'password12345')
      await expect(page).toHaveURL('/')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('/create')

      await createBlog(page, blog.title, blog.author, blog.url)

      await expect(page.getByRole('link', { name: `${blog.title} by ${blog.author}` })).toBeVisible()
    })

    describe('When a single blog has been created', () => {
      beforeEach(async ({ page }) => {
        await page.goto('/create')
        await createBlog(page, blog.title, blog.author, blog.url)
      })

      test('a blog can be liked', async ({ page }) => {
        await likeBlog(page, blog.title, blog.author, 1)

        await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()
        await expect(page.getByText('1 likes')).toBeVisible()
      })

      test('a blog can be deleted by the user that added it', async ({ page }) => {
        await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByRole('link', { name: `${blog.title} by ${blog.author}` })).not.toBeVisible()
      })
    })

    describe('When multiple blogs have been created and liked', () => {
      const blogs = [
        {
          title: 'The Pragmatic Programmer',
          author: 'Andrew Hunt and David Thomas',
          url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/'
        },
        {
          title: 'The Design of Everyday Things',
          author: 'Don Norman',
          url: 'https://www.basicbooks.com/titles/don-norman/the-design-of-everyday-things/9780465050659/'
        },
        {
          title: 'Hooked: How to Build Habit-Forming Products',
          author: 'Nir Eyal',
          url: 'https://www.nirandfar.com/hooked/'
        }
      ]

      beforeEach(async ({ page }) => {
        // test.setTimeout(30000) Waiting for like update to occur can take time. If each likeBlog fn. call takes 1.8 s, then 6 likeBlog() = 1.8 * 6 = 10.8 s > 10 s (playwright config file's timeout). So, it stops and you get the following error: Test timeout of 10000ms exceeded while running "beforeEach" hook.
        // or you can set the playwright config file's timout to 30s
        await createBlog(page, blogs[0].title, blogs[0].author, blogs[0].url)
        await createBlog(page, blogs[1].title, blogs[1].author, blogs[1].url)
        await createBlog(page, blogs[2].title, blogs[2].author, blogs[2].url)

        await likeBlog(page, blogs[0].title, blogs[0].author, 1)
        await likeBlog(page, blogs[1].title, blogs[1].author, 1)
        await likeBlog(page, blogs[1].title, blogs[1].author, 2)
        await likeBlog(page, blogs[2].title, blogs[2].author, 1)
        await likeBlog(page, blogs[1].title, blogs[1].author, 3)
        await likeBlog(page, blogs[0].title, blogs[0].author, 2)
      })

      test('blogs are arranged in the order of most likes', async ({ page }) => {
        const blogs = page.locator('.blog')

        await expect(blogs.nth(0)).toContainText('likes 3')
        await expect(blogs.nth(1)).toContainText('likes 2')
        await expect(blogs.nth(2)).toContainText('likes 1')
      })
    })
  })

  test('Only the user who added the blog can see its delete button', async ({ page }) => {
    await loginWith(page, 'neil123', 'password12345')
    await createBlog(page, 'Hooked: How to Build Habit-Forming Products', 'Nir Eyal', 'https://www.nirandfar.com/hooked/')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    await page.getByRole('button', { name: 'logout' }).click()

    await loginWith(page, 'albert123', 'emc2gravity')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })
})