import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.scss']
})
export class AccessDeniedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Inizializzazioni o logica aggiuntiva da eseguire quando il componente è inizializzato
  }

  navigateToHomePage(): void {
    this.router.navigate(['/']); 
  }
}
