import { useMemo, useState } from 'react'
import './CreatePostPage.css'

function CreatePostPage({ onBackToMarketplace, onCreatePost, userName }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Other')
  const [condition, setCondition] = useState('Good')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [photoFile, setPhotoFile] = useState(null)

  const photoPreview = useMemo(() => {
    if (!photoFile) {
      return ''
    }
    return URL.createObjectURL(photoFile)
  }, [photoFile])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) {
      return
    }

    const postData = {
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      location: location.trim() || 'Unknown',
      owner: userName,
      wants: [],
      price: Number(price) || 50,
      photo: photoPreview,
    }

    onCreatePost(postData)
  }

  return (
    <div className="create-post-wrap">
      <section className="create-post-card">
        <div className="create-post-header">
          <h1>Create Post</h1>
          <button type="button" onClick={onBackToMarketplace}>
            Back
          </button>
        </div>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <label>
            Product title
            <input
              type="text"
              placeholder="e.g. Sony Headphones"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Item description
            <textarea
              placeholder="Describe what you are trading, condition, and included accessories"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          <label>
            Add photo
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
            />
          </label>

          {photoPreview && <img className="post-photo-preview" src={photoPreview} alt="Item preview" />}

          <div className="post-grid">
            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Other</option>
                <option>Gaming</option>
                <option>Photography</option>
                <option>Music</option>
                <option>Home Office</option>
                <option>Kitchen</option>
              </select>
            </label>
            <label>
              Condition
              <select value={condition} onChange={(event) => setCondition(event.target.value)}>
                <option>Like New</option>
                <option>Excellent</option>
                <option>Great</option>
                <option>Good</option>
                <option>Used</option>
              </select>
            </label>
            <label>
              Location
              <input
                type="text"
                placeholder="e.g. San Jose"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>
            <label>
              Approx price
              <input
                type="number"
                min="1"
                placeholder="100"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="publish-btn">
            Publish Post
          </button>
        </form>
      </section>
    </div>
  )
}

export default CreatePostPage
