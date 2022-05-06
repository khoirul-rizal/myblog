import Loader from '../components/Loader'
import { firestore, fromMillis, postToJSON } from '../lib/fireabase'
import { useState } from 'react'
import PostFeed from '../components/PostFeed'

const LIMIT = 1

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==',true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

    const posts = await (await postsQuery.get()).docs.map(postToJSON);


  return {
    props: {posts}
  }

}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postEnd, setPostEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length -1]

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)
    
      const newPosts = (await query.get()).docs.map((doc) => doc.data())

      setPosts(posts.concat(newPosts))
      setLoading(false)

      if (newPosts.length < LIMIT) {
        setPostEnd(true)
      }
  }

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postEnd && <button onClick={getMorePosts}> Load More </button>}

      <Loader show={loading} />

      {postEnd && 'You have reached the end!'}
    </main>
  )
}
