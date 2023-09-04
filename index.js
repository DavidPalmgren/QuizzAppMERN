import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {MongoClient} from 'mongodb'

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const database = client.db('main')
const cards = database.collection('cards')

client.connect()
console.log('connected to mongodb')

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log('api running'))

app.get('/', async (req, res) => {
    const allCards = await cards.find().toArray()
    res.json(allCards)
})

app.post('/add-card', async (req, res) => {
    const { name, favorite } = req.body;
  
    try {
      const result = await cards.insertOne({ name, favorite });
      res.status(201).json({ message: 'Item was added', insertedId: result.insertedId });
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ message: 'Error adding item' });
    }
});
