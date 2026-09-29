import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { FetchdataService, Order } from '../fetchdata.service';

interface Chef {
  name: string;
  specialty: string;
  bio: string;
  image: string;
}

interface Review {
  text: string;
  author: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  recentOrders: Order[] = [];
  ordersLoading = false;

  constructor(
    private readonly sessionService: SessionService,
    private readonly fd: FetchdataService
  ) { }

  ngOnInit(): void {
    this.sessionService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.loadRecentOrders(user._id || user.email);
      } else {
        this.recentOrders = [];
      }
    });
  }

  loadRecentOrders(userId: string): void {
    this.ordersLoading = true;
    this.fd.getOrderHistory(userId).subscribe({
      next: (orders) => {
        this.recentOrders = orders
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
          .slice(0, 3);
        this.ordersLoading = false;
      },
      error: () => { this.ordersLoading = false; }
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

  chefs: Chef[] = [
    {
      name: 'Marco Rossi',
      specialty: 'Traditional Italian',
      bio: 'Master chef with 20+ years of experience in authentic Italian pizzeria',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      name: 'Giovanni Santini',
      specialty: 'Modern Fusion',
      bio: 'Creative pizzaiolo blending traditional and contemporary flavors',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
      name: 'Luigi Ferrari',
      specialty: 'Special Recipes',
      bio: 'Innovative chef creating signature pizzas and specialties',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    }
  ];

  reviews: Review[] = [
    {
      text: 'Absolutely delicious! The freshness of ingredients and perfect crust made it the best pizza I\'ve had in years.',
      author: 'Sarah Johnson',
      rating: 5
    },
    {
      text: 'Fast delivery and hot pizza every time. The custom pizza builder is fantastic - exactly what I wanted!',
      author: 'Mike Chen',
      rating: 5
    },
    {
      text: 'The flavors are authentic and the service is excellent. Highly recommend to everyone!',
      author: 'Emily Rodriguez',
      rating: 5
    }
  ];
}
