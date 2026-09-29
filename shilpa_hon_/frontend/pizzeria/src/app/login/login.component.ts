import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly sessionService: SessionService
  ) { }

  onSubmit() {
    this.http.post('http://localhost:7000/login', this.credentials).subscribe({
      next: (response: any) => {
        this.sessionService.setUser(response.user);
        this.router.navigate(['/shoppingcart']);
      },
      error: (error) => {
        alert(error.error?.message || 'Login failed');
      }
    });
  }
}
