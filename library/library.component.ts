import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService, Book } from '../libraryservice.service';
 
@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  books: Book[] = [];
  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    availability: 0,
    
  };
  editingIndex: number | null = null;
 
  constructor(private libraryService: LibraryService) {}
 
  ngOnInit(): void {
    this.getBooks();
  }
 
  getBooks(): void {
    this.libraryService.getBooks().subscribe((data) => {
      this.books = data;
    });
  }
 
  addBook(): void {
    if (this.newBook.id && this.newBook.title && this.newBook.author && this.newBook.availability > 0) {
      this.libraryService.addBook(this.newBook).subscribe(() => {
        this.getBooks();
        this.newBook = { id: 0, title: '', author: '', availability: 0 };
      });
    } else {
      alert('Please fill in all fields.');
    }
  }
 
  startEdit(index: number): void {
    this.editingIndex = index;
  }
 
  saveEdit(): void {
    if (this.editingIndex !== null) {
      const book = this.books[this.editingIndex];
      this.libraryService.updateBook(book.id, book).subscribe(() => {
        this.editingIndex = null;
        this.getBooks();
      });
    }
  }
 
  deleteBook(index: number): void {
    const book = this.books[index];
    if (confirm('Are you sure you want to delete this book?')) {
      this.libraryService.deleteBook(book.id).subscribe(() => {
        this.getBooks();
        if (this.editingIndex === index) {
          this.editingIndex = null;
        }
      });
    }
  }
}