import styles from "./ShippingAddress.module.scss";

export default function ShippingAddress({ shippingAddress }) {
  return (
    <div className={styles["shipping-info"]}>
      <div className={styles["shipping-info_group"]}>
        <span>address line 1</span>
        <span>{shippingAddress?.addressLine1}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>address line 2</span>
        <span>{shippingAddress?.addressLine2}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>city</span>
        <span>{shippingAddress?.city}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>state</span>
        <span>{shippingAddress?.state}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>Postal code</span>
        <span>{shippingAddress?.postalCode}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>Country</span>
        <span>{shippingAddress?.countryCode}</span>
      </div>
    </div>
  );
}
