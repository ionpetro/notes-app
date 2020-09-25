import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
        //then scale down back to normal size while beginning to fade out
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
  filteredNotes: Note[] = new Array<Note>();
  display: string = 'list';

  @ViewChild('filterInput') filterInputElementRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    // we want to retrieve all notes from NotesService
    this.notes = this.notesService.getAll();

    this.filteredNotes = this.notesService.getAll();

  }

  changeDisplay(chosenDisplay: string) {
    this.display = chosenDisplay;
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    // this.filter(this.filterInputElementRef.nativeElement.value);
    this.notes = this.filteredNotes = this.notesService.getAll();

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.filteredNotes, event.previousIndex, event.currentIndex);
  }

  generateNoteURL(note: Note) {
    return this.notesService.getId(note);

  }

  filter(query: string) {

    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    // split up the search query into individual words
    let terms: string[] = query.split(' ');
    // remove duplicates search terms
    terms = this.removeDuplicates(terms);
    //compile all relevant results into the allResults array
    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      //append results to the allResults array
      allResults = [...allResults, ...results]

    });
    // allResults will include duplicate notes
    // because a particular note can be the results of many search terms
    // but we don't want to show the same note multiple times on the UI
    // so we first must remove the duplicates
    let uniqueResults = this.removeDuplicates(allResults);

    this.filteredNotes = uniqueResults;

    // sort by relevancy
    this.sortByRelevancy(allResults);

  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // loop through the array and add items to the set
    arr.forEach(e => uniqueResults.add(e))
    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {

    //searching algorithm
    query = query.toLowerCase().trim();
    let relevantNotes= this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }

      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    })

    return relevantNotes;

  }

  sortByRelevancy(searchResults: Note[]) {
    // calculate the relevancy based on the times a term appears
    let noteCountObj: Object = {}; //key:value => NoteId: number

    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note); // get the notes id

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort( (a:Note, b:Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }

}
