import { Component, OnInit } from '@angular/core';
import { FetchdataService, Order } from '../fetchdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private readonly fd: FetchdataService, private readonly router: Router) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (!userData) { this.router.navigate(['/login']); return; }
    const user = JSON.parse(userData);
    this.isLoading = true;
    this.fd.getOrderHistory(user._id || user.email).subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load order history.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'pending': 'warning', 'confirmed': 'info', 'preparing': 'info',
      'out-for-delivery': 'primary', 'delivered': 'success', 'cancelled': 'danger'
    };
    return map[status] || 'secondary';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
