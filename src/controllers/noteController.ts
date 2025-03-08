import { Request, Response, NextFunction } from "express";
import Note from "../models/noteModel";
import { NotFoundError, BadRequestError } from "../middleware/errorHandler";

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) throw new NotFoundError("Note not found");
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) throw new BadRequestError("Title and content are required");

    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response) => {
    try {
      const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updatedNote) return res.status(404).json({ message: "Note not found" });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};
  

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) throw new NotFoundError("Note not found");
        res.json({ message: `Note with id: ${ deletedNote._id } deleted` });
    } catch (error) {
        next(error);
    }
};
