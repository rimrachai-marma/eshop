import OrderItem from "./OrderItem";

export default function OrderItems({ orderItems }) {
  return (
    <ul>
      {orderItems?.map((orderItem) => (
        <OrderItem key={orderItem.sku} orderItem={orderItem} />
      ))}
    </ul>
  );
}
