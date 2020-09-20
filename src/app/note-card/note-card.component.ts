import { Component, ElementRef, Input, Output, Renderer2, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { NotesService } from '../shared/notes.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements AfterViewInit {

  @Input() title: string;
  @Input() body: string;
  @Input() link: string;

  @ViewChild('truncator', { static:true}) truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText',  { static:true}) bodyText: ElementRef<HTMLElement>;

  contentHeight: number;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private renderer: Renderer2,
  ) { }

    onButtonClick() {
      this.deleteEvent.emit();
    }


  ngAfterViewInit(): void {

    this.contentHeight = this.bodyText.nativeElement.scrollHeight;

    // work out if there is a text overflow and if not, then hide the trucator
    if (this.contentHeight > 81) {
      // if there is a text overflow, show the fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      // else (there is no text overflow), hide the fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }

  }


  }
