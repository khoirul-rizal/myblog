import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/fireabase";

export async function getServerSideProps({query}) {
  const {username} = query

  const userDoc = await getUserWithUsername(username)

  if (!userDoc) {
    return {
      notFound: true
    }
  }

  let user = null
  let posts = null

  if(userDoc) {
    user = userDoc.data()
    const postQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)

    posts = (await postQuery.get()).docs.map(postToJSON)
  }

  return {
    props: {user, posts}
  }
}

export default function UserPage({user, posts}) {
  return (
    <main>
      <Metatags title="feed" />
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}