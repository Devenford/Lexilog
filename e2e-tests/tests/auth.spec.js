// login and sign up e2e testing
import { test, expect } from '@playwright/test'
import { signupWith, testUser, loginWith, logout } from './helper'

const { describe, beforeEach } = test

beforeEach(async ({ page, request }) => {
  await request.post('/api/testing/reset')
  await page.goto('/')
})

test('front page can be opened', async ({ page }) => {
  await expect(page.getByText('Unlock the Power of Words')).toBeVisible()
})

test('user can sign up', async ({ page }) => {
  await signupWith(page, testUser.username, testUser.name, testUser.password)
  await expect(page).toHaveURL('/') //redirected to home page on successful sign up
  await expect(page.getByText(`Welcome back ${testUser.username}`)).toBeVisible()
})

describe('user login', () => {
  beforeEach(async ({ page }) => {
    await signupWith(page, testUser.username, testUser.name, testUser.password)
    await logout(page)
  })

  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)
    await expect(page).toHaveURL('/') //redirected to home page on successful login
    await expect(page.getByText(`Welcome back ${testUser.username}`)).toBeVisible()
  })

  test('fails with the wrong credentials', async ({ page }) => {
    await loginWith(page, testUser.username, 'wrong password')
    await expect(page.getByText('wrong username or password')).toBeVisible()
  })
})
