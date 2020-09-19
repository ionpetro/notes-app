import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // ENTRY ANIMATION
      transition('void => *', [
        // Initial State
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          //we have to expand out the padding properties
          'padding-top': 0,
          'padding-bottom': 0,
          'padding-right': 0,
          'padding-left': 0,
        }),
        // animating the spacing
        animate('50ms', style({
          //the height of the element
          height: '*',
          'margin-bottom': '*',
          'padding-top': 0,
          'padding-bottom': 0,
          'padding-right': 0,
          'padding-left': 0,
        })),
        animate(150)
      ]),

      transition('* => void', [
        //first we scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        //then scale down back to normal size while beggining to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75,
        })),
        // finally we hide the item completely
        animate('120ms ease-out', style({
          opacity: 0,
          transform: 'scale(0.68)',
        })),

        // //then animate the spacing (which includes height and margin)
        animate('150ms ease-out', style({
          height: 0,
          'padding-top': 0,
          'padding-bottom': 0,
          'padding-right': 0,
          'padding-left': 0,
          'margin-bottom': '0',
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional:true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    // we want to retrieve all notes from NotesService
    this.notes = this.notesService.getAll();
  }

  deleteNote(id: number) {
    this.notesService.delete(id);
  }

}
