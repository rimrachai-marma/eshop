import CheckoutItem from "./CheckoutItem";

export default function CheckoutItems({ checkoutItems }) {
  return (
    <ul>
      {checkoutItems.map((checkoutItem) => (
        <CheckoutItem key={checkoutItem.id} checkoutItem={checkoutItem} />
      ))}
    </ul>
  );
}
