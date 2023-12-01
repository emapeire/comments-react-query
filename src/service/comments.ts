export interface Comment {
  title: string
  message: string
  preview?: boolean
}

export interface CommentWithId extends Comment {
  id: string
}

const apiKey = process.env.API_KEY

if (!apiKey) {
  throw new Error('API key is not defined')
}

export const getComments = async () => {
  const response = await fetch(
    'https://api.jsonbin.io/v3/b/656a28150574da7622cee9c9',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': apiKey
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch comments.')
  }

  const json = await response.json()

  return json?.record
}

export const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export const postComment = async (comment: Comment) => {
  const comments = await getComments()

  const id = crypto.randomUUID()
  const newComment = { ...comment, id }
  const commentsToSave = [...comments, newComment]

  const response = await fetch(
    'https://api.jsonbin.io/v3/b/656a28150574da7622cee9c9',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': apiKey
      },
      body: JSON.stringify(commentsToSave)
    }
  )

  if (!response.ok) {
    throw new Error('Failed to post comment.')
  }

  return newComment
}
