export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví MoMo',
    icon: '/images/payment/momo.png'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ZaloPay',
    icon: '/images/payment/zalopay.png'
  },
  {
    id: 'credit-card',
    name: 'Thẻ tín dụng',
    description: 'Thanh toán qua thẻ Visa/Mastercard',
    icon: '/images/payment/credit-card.png'
  },
  {
    id: 'bank-transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp',
    icon: '/images/payment/bank-transfer.png'
  }
]; 