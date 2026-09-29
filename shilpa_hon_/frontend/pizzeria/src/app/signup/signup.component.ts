import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = { name: '', email: '', password: '' };

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  onSubmit() {
    this.http.post('http://localhost:7000/signup', this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert(error.error?.message || 'Signup failed');
      }
    });
  }
}
