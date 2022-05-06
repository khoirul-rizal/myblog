import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from '../../styles/Admin.module.css'
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimestamp } from "../../lib/fireabase";
import { useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";

export default function AdminEditPage({ }) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)
  const router = useRouter()
  const {slug} = router.query

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
  const [post] = useDocumentDataOnce(postRef)

  return (
    <main className={styles.container}>
      { post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}

    </main>
  )
}

function PostForm({defaultValues, postRef, preview}) {
  const {register, handleSubmit, reset, watch, formState, errors} = useForm({defaultValues, mode: 'onChange'})

  const {isValid, isDirty} = formState
  const _published = watch('published')
  const updatePost = async ({content, published}) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp()
    })

    reset({content, published})

    toast.success('Post updated succesfully!')
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div>
          <ReactMarkdown className="card">
            {watch('content')}
          </ReactMarkdown>
        </div>
      )}
      <ImageUploader />
      <div className={preview ? styles.hidden: styles.controls}>
        <textarea name="content" ref={register({
          maxLength: 20000,
          minLength: 10,
          required: true
        })}></textarea>

        {errors.content && <p className="text-danger">Form invalid</p>}

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" ref={register} />
          <label>Published</label>
          {_published && <p>YOUR DATA WILL BE Published</p>}
        </fieldset>
        <button type="submit" className="btn-green" disabled={false} >
          Save Change
        </button>
      </div>
    </form>
  )
}