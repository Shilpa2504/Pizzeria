import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly userSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public readonly user$: Observable<User | null> = this.userSubject.asObservable();

  private getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  getCurrentUserSync(): User | null {
    return this.userSubject.value;
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  refreshUser(): void {
    this.userSubject.next(this.getCurrentUser());
  }
}
