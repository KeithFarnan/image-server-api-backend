const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');

const { Event, validate } = require('../../models/event');
const multer = require('multer');
const { User } = require('../../models/user');
const { Image } = require('../../models/image');
const { upload } = require('../../multer');

router.post('/', upload.array('pictures'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('invalid user');

  const images = req.files.map(file => ({
    imageTitle: file.filename,
    imageUrl: file.path
  }));
  console.log(images);
  try {
    let event = new Event({
      user: {
        _id: user.id,
        name: user.name
      },
      eventTitle: req.body.eventTitle,
      eventDate: req.body.date,
      images: images
    });
    res.json(event);
    event.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/events
// @desc     Get all events
// @access   Private
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/events/:id
// @desc     Get event by ID
// @access   Private
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/events/:id
// @desc     Delete a event
// @access   Private
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndRemove(req.params.id);
    if (!event) return res.status(404).send('this event does not exist');
    res.send(event);
    res.json({ msg: 'event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/events/like/:id
// @desc     Like a event
// @access   Private
router.put('/:id', async (req, res) => {
  const { error } = validateevent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const event = await event.findById(req.params.id);
    if (!event) return res.status(400).send('invalid event id');

    event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
