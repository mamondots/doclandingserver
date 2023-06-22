const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//middlewere

const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i6scrno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const doctorCollection = client.db('Doctor').collection('CartDoctor')
    const reviewsCollection = client.db('Doctor').collection('reviews')
    const usersCollection = client.db('Doctor').collection('users')
    const appointmentsCollection = client.db('Doctor').collection('appointments')
    const bookAppointmentsCollection = client.db('Doctor').collection('bookAppointments')


    //all user

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    //post user

    app.post('/users', async (req, res) => {
      const user = req.body
      console.log(user)
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })


    //All Doctors
    app.get('/doctors', async (req, res) => {
      const result = await doctorCollection.find().toArray()
      res.send(result)
    })

    //Doctor single details

    app.get('/doctors/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await doctorCollection.findOne(query)
      res.send(result)
    })

    //post doctor

    app.post('/doctors', async (req, res) => {
      const doctor = req.body
      console.log(doctor)
      const result = await doctorCollection.insertOne(doctor)
      res.send(result)
    })


    //update doctor

    app.patch('/doctors/:id', async (req, res) => {
      const id = req.params.id
      const updatedData = req.body
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          ...updatedData
        }
      }
      const result = await doctorCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


    //delete doctor

    app.delete('/doctors/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await doctorCollection.deleteOne(query)
      res.send(result)
    })

    //all appointment

    app.get('/appointments', async (req, res) => {
      const result = await appointmentsCollection.find().toArray()
      res.send(result)
    })


    //post books appiment

    app.post('/bookAppointments', async (req, res) => {
      const bookAppointment = req.body
      console.log(bookAppointment)
      const result = await bookAppointmentsCollection.insertOne(bookAppointment)
      res.send(result)
    })

    // Reviews

    app.get('/reviews', async (req, res) => {
      const result = await reviewsCollection.find().toArray()
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Doctor side is running')
})

app.listen(port, () => {
  console.log(`Doctor side is running on port, ${port}`)
})