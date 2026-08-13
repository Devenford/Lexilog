import { test, expect } from '@playwright/test'
import { signupWith, testUser } from './helper'

const { describe, beforeEach } =  test
const TEST_SIZE = 10

describe('Multiple Choice Practice', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await page.goto('/')
    await signupWith(page, testUser.username, testUser.name, testUser.password)
  })

  test('user is able to take a multiple choice quiz and their streak is updated on completion', async ({ page }) => {
    await page.getByRole('button', { name: 'Practice' }).click()
    await expect(page).toHaveURL('/practice')
    await page.getByRole('button', { name: 'Multiple Choice' }).click()
    await expect(page).toHaveURL('/practice/multiplechoice')
    await expect(page.getByText('Question 1')).toBeVisible() // wait for server response with quiz data

    for (let i=0; i<TEST_SIZE; i++) {
      const options = await page.getByTestId('MultipleChoiceCard').getByRole('button').all()
      await options[0].click()
      await options[1].click()
      await options[2].click()
      await options[3].click()
      await page.getByRole('button', { name: 'Next' }).click()
    }

    await page.getByRole('button', { name: 'Return to Practice' }).click()
    await expect(page).toHaveURL('/practice')

    await page.getByTestId('Home').click()
    await expect(page.getByText('🔥 Streak: 1 day', { exact: true })).toBeVisible()
    await expect(page.getByText('🏆 Longest Streak: 1 day', { exact: true })).toBeVisible()
  })

  test('quiz is not submitted and the streak, coins, and xp of the user are not updated if the user does not complete the quiz', async ({ page }) => {
    await page.getByRole('button', { name: 'Practice' }).click()
    await expect(page).toHaveURL('/practice')
    await page.getByRole('button', { name: 'Multiple Choice' }).click()
    await expect(page).toHaveURL('/practice/multiplechoice')
    await expect(page.getByText('Question 1')).toBeVisible() // wait for server response with quiz data

    // only 9/10 questions are attempted
    for (let i=0; i<TEST_SIZE-1; i++) {
      const options = await page.getByTestId('MultipleChoiceCard').getByRole('button').all()
      await options[0].click()
      await options[1].click()
      await options[2].click()
      await options[3].click()
      await page.getByRole('button', { name: 'Next' }).click()
    }

    await page.getByTestId('Home').click()
    await expect(page.getByTestId('Coins-Count').getByText('0')).toBeVisible()
    await expect(page.getByTestId('XP-Count').getByText('0')).toBeVisible()
    await expect(page.getByText('🔥 Streak: 0 days', { exact: true })).toBeVisible()
    await expect(page.getByText('🏆 Longest Streak: 0 days', { exact: true })).toBeVisible()
  })
})