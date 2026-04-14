import { Component, OnInit } from '@angular/core';
import { FetchdataService, User, Address } from '../fetchdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  isLoading = false;
  isEditing = false;
  successMessage = '';
  errorMessage = '';
  editingUser: User = { name: '', email: '' };

  constructor(private readonly fd: FetchdataService, private readonly router: Router) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (!userData) { this.router.navigate(['/login']); return; }
    try {
      this.user = JSON.parse(userData);
      if (this.user) this.editingUser = { ...this.user };
    } catch {
      this.errorMessage = 'Failed to load user profile';
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) { this.editingUser = { ...this.user }; this.errorMessage = ''; }
  }

  saveProfile(): void {
    if (!this.user?._id) return;
    if (!this.editingUser.name || !this.editingUser.email) {
      this.errorMessage = 'Name and email are required'; return;
    }
    this.isLoading = true;
    this.fd.updateUserProfile(this.user._id, this.editingUser).subscribe({
      next: () => {
        this.user = { ...this.editingUser };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to update profile.';
        this.isLoading = false;
      }
    });
  }
}
