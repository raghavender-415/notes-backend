const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// All notes routes are protected
router.use(protect);

// @route   GET /api/notes
// @desc    Get all notes for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { tag, pinned, search } = req.query;

    const filter = { user: req.user._id };
    if (tag) filter.tags = tag;
    if (pinned !== undefined) filter.isPinned = pinned === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    const note = await Note.create({
      title,
      content,
      tags,
      isPinned,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully.',
      note,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a single note
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, tags, isPinned },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully.',
      note,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/notes/:id/pin
// @desc    Toggle pin status of a note
// @access  Private
router.patch('/:id/pin', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully.`,
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
