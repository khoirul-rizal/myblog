import { useEffect } from "react"
import { firestore, postToJSON } from "../lib/fireabase";

export default function CollectGroupPage() {
  const hitPost = async () => {
    const postsQuery = firestore
      .collectionGroup('posts')
      .where('published', '==',true)
      .orderBy('createdAt', 'desc')
      .limit(1)

      const posts = (await postsQuery.get()).docs.map((doc) => postToJSON(doc));
      const a = (await postsQuery.get()).docs.map((doc) => console.log('!CollectionGroup - ', doc.data()))
      console.log('!posts - ', posts)
  }
  return (
    <main>
      <button onClick={hitPost}>Hit Post</button>
    </main>
  )
}