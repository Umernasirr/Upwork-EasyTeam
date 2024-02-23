export interface IProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface ICommissionPlan {
  id: number;
  productId: number;
  commissionRate: number;
}

export interface IOrder {
  items: IOrderItem[];
  id: number;
  createdAt: Date;
  staffMemberId: number;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  product: IProduct;
}

export interface IStaffMember {
  id: number;
  name: string;
}
