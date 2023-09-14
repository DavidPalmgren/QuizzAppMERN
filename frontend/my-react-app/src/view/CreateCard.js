import { useState } from "react";

const CreateCard = () => {
  const [answer, setAnswer] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mario');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { answer, description, category };

    fetch('http://localhost:4040/api/add-card', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('new card added: ' + JSON.stringify(data));
    }).catch( () => {
        console.log("yikes")
    })
  }

  return (
    <div className="create">
      <h2>Add a flashcard</h2>
      <form onSubmit={handleSubmit}>
        <label>Card answer:</label>
        <input 
          type="text" 
          required 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <label>Card description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Card category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="History">History</option>
          <option value="Science">Science</option>
        </select>
        <button>Add Blog</button>
      </form>
    </div>
  );
}
 
export default CreateCard;