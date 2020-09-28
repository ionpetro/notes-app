import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  labelOptions = ['blue', 'red', 'yellow', 'green'];
  note: Note;
  noteId: number;
  new: boolean;
  public selectedVal: string;

  constructor(
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute,
    // public dialogRef: MatDialogRef<NoteDetailsComponent>,
  ) { }

  ngOnInit() {

    this.selectedVal = this.labelOptions[0];

    // we want to find out if we create new note
    // or editing an existing one
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params.id) {
        this.note = this.notesService.get(params.id);
        this.noteId = params.id;
        this.new = false;
      } else {
        this.new = true;
      }
    })


  }

  onSubmit(form: NgForm) {
    if(this.new) {
      // save the note
        console.log(form.value);

        this.notesService.add(form.value);
      } else {
        this.notesService.update(this.noteId, form.value.title, form.value.body, form.value.label);
      }
      this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/');
  }

}
