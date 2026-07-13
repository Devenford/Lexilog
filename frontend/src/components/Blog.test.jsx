import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

const blog = {
  title: 'How Vitest Works',
  author: 'Bob Schmo',
  url: 'https://bobschmo.com/',
  likes: 5,
  user: {
    username: 'bobby482',
    name: 'Bob The Builder',
    id: '6a2a6de5c8975c5ee31a9179'
  },
  id: '6a2944df425227018a4d686a'
}
const user = {
  username: 'neil234',
  name: 'Neil Brian',
  id: '6a2a6de5c8975c5ee31a8470'
}
const blogCreator =   {
  username: 'bobby482',
  name: 'Bob The Builder',
  id: '6a2a6de5c8975c5ee31a9179'
}

test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
  const route = `/blogs/${blog.id}`
  render(
    <MemoryRouter initialEntries={[route]}>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  expect(screen.getByText(`${blog.title}`)).toBeDefined()
  expect(screen.getByText(`by ${blog.author}`)).toBeDefined()
  expect(screen.getByText(`${blog.url}`)).toBeDefined()
  expect(screen.getByText(`Added by ${blog.user.name}`)).toBeDefined()
  expect(screen.getByText(`${blog.likes} likes`)).toBeDefined()

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('Authenticated users who are not the blog\'s creator are shown only the like button', async () => {
  const route = `/blogs/${blog.id}`
  render(
    <MemoryRouter initialEntries={[route]}>
      <Blog blog={blog} user={user}/>
    </MemoryRouter>
  )

  expect(screen.queryByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('The blog\'s creator is shown the delete button', async () => {
  const route = `/blogs/${blog.id}`
  render(
    <MemoryRouter initialEntries={[route]}>
      <Blog blog={blog} user={blogCreator}/>
    </MemoryRouter>
  )

  expect(screen.queryByRole('button', { name: 'remove' })).toBeDefined()
})

test('if the like button is clicked twice, the event handler is called twice', async () => {
  const mockHandler = vi.fn()
  const route = `/blogs/${blog.id}`

  render(
    <MemoryRouter initialEntries={[route]}>
      <Blog blog={blog} user={blogCreator} updateLikes={mockHandler}/>
    </MemoryRouter>
  )

  const userSession = userEvent.setup() // you cannot use the variable name "user" here since the render line above calls/references user. Doing so would cause it to call the hoisted, uninitialized userEvent "user" instead, since it's within the local scope and is hoisted.
  const button = screen.getByText('like')
  await userSession.click(button)
  await userSession.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})