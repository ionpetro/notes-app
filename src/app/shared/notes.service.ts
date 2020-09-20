import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();

  constructor() { }

  get(id: number) {
    return this.notes[id];
  }

  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  getAll(): Note[] {
    return this.notes;
  }

  add(note: Note) {
  /**
   * this method will add a note to the notes
   * array and return the id of the note
  */
    let newLength = this.notes.push(note);
    let index = newLength - 1;
    return index;

  }

  update(id: number, title: string, body: string, label: string){
    let note = this.notes[id];
    note.title = title;
    note.body = body;
    note.label = label;
  }

  delete(id: number) {
    this.notes.splice(id, 1);
  }

 }
