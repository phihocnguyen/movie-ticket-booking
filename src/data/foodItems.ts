export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'food' | 'drink' | 'combo';
}

export const foodItems: FoodItem[] = [
  {
    id: 'popcorn-small',
    name: 'Bắp rang bơ nhỏ',
    description: 'Bắp rang bơ thơm ngon, size nhỏ',
    price: 35000,
    image: '/images/food/popcorn-small.jpg',
    category: 'food'
  },
  {
    id: 'popcorn-medium',
    name: 'Bắp rang bơ vừa',
    description: 'Bắp rang bơ thơm ngon, size vừa',
    price: 45000,
    image: '/images/food/popcorn-medium.jpg',
    category: 'food'
  },
  {
    id: 'coke',
    name: 'Coca Cola',
    description: 'Nước ngọt Coca Cola',
    price: 25000,
    image: '/images/food/coke.jpg',
    category: 'drink'
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    description: 'Nước ngọt Pepsi',
    price: 25000,
    image: '/images/food/pepsi.jpg',
    category: 'drink'
  },
  {
    id: 'combo-1',
    name: 'Combo 1',
    description: '1 bắp rang bơ vừa + 2 nước ngọt',
    price: 85000,
    image: '/images/food/combo-1.jpg',
    category: 'combo'
  },
  {
    id: 'combo-2',
    name: 'Combo 2',
    description: '1 bắp rang bơ lớn + 2 nước ngọt + 1 hotdog',
    price: 120000,
    image: '/images/food/combo-2.jpg',
    category: 'combo'
  }
]; 