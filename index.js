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

app.listen(4040, () => console.log('api running'))

app.get('/', async (req, res) => {
    const allCards = await cards.find().toArray()
    res.json(allCards)
})

app.post('/', async (req, res) => {
    await cards.insertOne({ name: 'Fool', favorite: true})
    res.json('Item was added')
})