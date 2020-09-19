import { Component, ElementRef, Input, Output, OnInit, Renderer2, ViewChild, EventEmitter } from '@angular/core';
import { NotesService } from '../shared/notes.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() title: string;
  @Input() body: string;
  @Input() link: string;

  @ViewChild('truncator', { static:true}) truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText',  { static:true}) bodyText: ElementRef<HTMLElement>;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {

    // work out if there is a text overflow and if not, then hide the trucator
    if (this.bodyText.nativeElement.scrollHeight > 81) {
      // if there is a text overflow, show the fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      // else (there is no text overflow), hide the fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  onButtonClick() {
    this.deleteEvent.emit();
  }


  }
