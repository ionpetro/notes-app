import { Inject, Injectable } from '@angular/core';
import { Note } from './note.model';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();
  display: string;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  get(id: number) {
    return this.notes[id];
  }

  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  getAll(): Note[] {
    this.notes = this.storage.get('notes') || [];
    // this.notes = JSON.parse(localStorage.getItem('notes'));
    return this.notes;
  }

  add(note: Note) {
  /**
   * this method will add a note to the notes
   * array and return the id of the note
  */
    let newLength = this.notes.push(note);
    this.storage.set('notes', this.notes);
    // localStorage.setItem('notes', JSON.stringify(this.notes));
    let index = newLength - 1;
    return index;

  }

  update(id: number, title: string, body: string, label: string){
    let note = this.notes[id];
    note.title = title;
    note.body = body;
    note.label = label;
    this.storage.set('notes', this.notes);
    // localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  delete(id: number) {
    //delete item from local storage
    let allNotes = this.storage.get('notes');
    // let allNotes = JSON.parse(localStorage.getItem('notes'));
    allNotes.splice(id, 1);
    this.storage.set('notes', allNotes)
    // localStorage.setItem('notes', JSON.stringify(allNotes));
    this.notes.splice(id, 1);

  }

  getDisplay(): string {
    this.display = this.storage.get('display');
    return this.display;
  }

  setDisplay(view: string) {
    this.storage.set('display', view);
  }

 }
