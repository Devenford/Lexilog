const testUser = {
  username: 'albert123',
  name: 'Albert Einstein',
  password: 'emc2gravity'
}

const signupWith = async (page, username, name, password) => {
  await page.locator('header').getByRole('button', { name: 'Sign Up' }).click()
  await page.getByLabel('Username', { exact: true }).fill(username)
  await page.getByLabel('Name', { exact: true }).fill(name)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click()
}

const loginWith = async (page, username, password) => {
  await page.locator('header').getByRole('button', { name: 'Login' }).click()
  await page.getByLabel('Username', { exact: true }).fill(username)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.locator('form').getByRole('button', { name: 'Login' }).click()
}

const logout = async (page) => {
  await page.locator('header').getByRole('button', { name : 'logout' }).click()
}

export {
  testUser,
  signupWith,
  loginWith,
  logout
}