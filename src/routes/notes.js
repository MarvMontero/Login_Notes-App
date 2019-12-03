const express = require('express');
const router = express.Router();


//Models
const Note = require('../models/Note');

//Helpers
const { isAuthenticated } = require('../helpers/auth');


//New Note
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note',isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please write a title' });
    }
    if (!description) {
        errors.push({ text: 'Please write a description' });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id; //all the data from the user it's save in req.user, so in this part, we get just the id for save it in the database.
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully');
        res.redirect('/notes');

    }

});

//Get all notes
router.get('/notes',isAuthenticated, async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc' }); //bringing the data just for the user that are singin 
    res.render('notes/all-notes', { notes });
});

//Edit Notes
router.get('/notes/edit/:id',isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('/notes');
    }
    res.render('notes/edit-note', { note });
});

//Update Notes
router.put('/notes/edit-note/:id',isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Note Updated Successfully'); //It sends a messages throught windows
    res.redirect('/notes');
});


//Delete Notes
router.delete('/notes/delete/:id',  isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;