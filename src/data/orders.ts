// TODO(backend): Replace with GET /api/orders/:orderId
import { MockOrder, OrderStatusStep } from "@/types";

export const orderStatusSteps: OrderStatusStep[] = [
  "Order Placed",
  "Order Confirmed",
  "Payment Confirmed",
  "Jewellery in Making",
  "Quality Check",
  "Ready for Delivery",
  "Delivered",
];

export const mockOrders: Record<string, MockOrder> = {
  "SRA-2026-00124": {
    orderId: "SRA-2026-00124",
    customerName: "Divya Sundaram",
    orderDate: "12 Aug 2026",
    estimatedDelivery: "26–28 Aug 2026",
    currentStepIndex: 3,
    items: [
      { productId: "SRA-001", name: "Classic Gold Band Ring", quantity: 1, price: 42500 },
    ],
    total: 42500,
  },
  "SRA-2026-00098": {
    orderId: "SRA-2026-00098",
    customerName: "Arun Kumar",
    orderDate: "02 Aug 2026",
    estimatedDelivery: "16 Aug 2026",
    currentStepIndex: 6,
    items: [
      { productId: "SRA-013", name: "Classic Lakshmi Gold Necklace", quantity: 1, price: 168000 },
    ],
    total: 168000,
  },
  "SRA-2026-00045": {
    orderId: "SRA-2026-00045",
    customerName: "Priya Ramaswamy",
    orderDate: "20 Jul 2026",
    estimatedDelivery: "05 Aug 2026",
    currentStepIndex: 1,
    items: [
      { productId: "SRA-046", name: "Bridal Kundan Necklace Set", quantity: 1, price: 312000 },
    ],
    total: 312000,
  },
};
