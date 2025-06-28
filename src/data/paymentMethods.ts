export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Tiền mặt',
    description: 'Thanh toán tại quầy bằng tiền mặt',
    icon: '/images/payment/cash.png'
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Thanh toán qua VNPay',
    icon: '/images/payment/vnpay.png'
  }
]; 