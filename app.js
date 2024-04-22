import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dbOperations } from './database.js'

const app = express()
app.use(express.json())
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/get-students", async (req, res) => {
    try {
      const rows = await dbOperations.getAllRegisteredStudents()
      res.json(rows)
    } catch (error) {
      res.status(500).send('Error fetching data.')
    }
})

app.get("/get-count", async (req, res) => {
  try {
    const TIMESLOTS = [ //array of all 6 timeslots
      "4/19/2070, 6:00 PM - 7:00 PM ",
      "4/19/2070, 7:00 PM - 8:00 PM ",
      "4/19/2070, 8:00 PM - 9:00 PM ",
      "4/20/2070, 6:00 PM - 7:00 PM ",
      "4/20/2070, 7:00 PM - 8:00 PM ",
      "4/20/2070, 8:00 PM - 9:00 PM ",
    ];
    const count_remaining_seats = []  //empty array to store remainder of seats respectively
    for (let i = 0; i < TIMESLOTS.length; i++) {  //fill count_remaining_seats array
      var count = await dbOperations.getCount(TIMESLOTS[i])
      count_remaining_seats.push(6-count)
    }
    res.status(201).send(count_remaining_seats) //send resulting array back to client
  } catch (error) {
    res.status(500).send('Error fetching data')
  }
})

app.post("/check-id", async (req, res) => {
  try {
    const id = req.body.id
    const result = await dbOperations.isIdUnique(id)
    res.status(201).send(result)
  } catch (error) {
    res.status(500).send('Error checking student ID.')
  }
})

app.post("/delete-registration", async (req, res) => {
  try {
    const id = req.body.id
    const result = await dbOperations.deleteStudent(id)
    res.status(201).send(result)
  } catch (error) {
    res.status(500).send("Error deleting registration.")
  }
})

app.post("/register", async (req, res) => {
  try {
    const { id, fname, lname, project_name, email_address, phone_number, timeslot } = req.body
    const result = await dbOperations.registerStudent(id, fname, lname, project_name, email_address, phone_number, timeslot)
    res.status(201).send(result)
  } catch (error) {
    res.status(500).send('Error registering student.')
  }
})

// Set up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});