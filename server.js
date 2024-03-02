const express = require('express');
const fs = require('fs/promises');
const uuid = require('./helpers/uuid')
const noteData = require('./db/db.json');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));

app.get('/notes', (req,res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html')));

  
app.get('/api/notes', (req,res) => 
  res.json(noteData));

app.post('/api/notes', (req,res) => {
    const addNote = {
        note_id:uuid(),
        title:req.body.title,
        text: req.body.text,
    };
    
    fs.readFile('./db/db.json', 'utf-8')
    .then((data) => {
        notes = JSON.parse(data);
        notes.push(addNote);
        updatedNotes= JSON.stringify(notes);
        fs.writeFile('./db/db.json',updatedNotes, (err) =>
        err ? console.error(err) : console.log(`note written to database`)
        );
        res.json(notes);
    });
});
app.get('*', (req,res) =>
  res.sendFile(path.join(__dirname, "./public/index.html")));

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})