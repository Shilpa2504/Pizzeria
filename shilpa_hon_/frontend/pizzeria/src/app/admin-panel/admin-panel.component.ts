import { Component, OnInit } from '@angular/core';
import { FetchdataService, Order } from '../fetchdata.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  dashboardStats: any = {};
  isLoading = false;
  errorMessage = '';
  statusFilter = 'all';
  updatingOrderId: string | null = null;

  statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'info' },
    { value: 'preparing', label: 'Preparing', color: 'info' },
    { value: 'out-for-delivery', label: 'Out for Delivery', color: 'primary' },
    { value: 'delivered', label: 'Delivered', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' }
  ];

  constructor(private readonly fd: FetchdataService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadDashboardStats();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.fd.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load orders.';
        this.isLoading = false;
      }
    });
  }

  loadDashboardStats(): void {
    this.fd.getDashboardStats().subscribe({
      next: (stats) => { this.dashboardStats = stats; },
      error: () => { }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.statusFilter === 'all'
      ? [...this.orders]
      : this.orders.filter(o => o.status === this.statusFilter);
  }

  updateOrderStatus(orderId: string | undefined, newStatus: string): void {
    if (!orderId) return;
    this.updatingOrderId = orderId;
    this.fd.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === orderId);
        if (order) { order.status = newStatus as any; this.applyFilters(); }
        this.updatingOrderId = null;
      },
      error: () => {
        this.errorMessage = 'Failed to update order status.';
        this.updatingOrderId = null;
      }
    });
  }

  getStatusColor(status: string): string {
    return this.statusOptions.find(opt => opt.value === status)?.color || 'secondary';
  }

  getTotalRevenue(): number {
    return this.orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  refresh(): void { this.loadOrders(); this.loadDashboardStats(); }
}
