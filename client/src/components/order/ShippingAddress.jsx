import styles from "./ShippingAddress.module.scss";

export default function ShippingAddress({ shipping }) {
  return (
    <div className={styles["shipping-info"]}>
      <div className={styles["shipping-info_group"]}>
        <span>name</span>
        <span>{shipping?.name}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>address line 1</span>
        <span>{shipping?.address.addressLine1}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>address line 2</span>
        <span>{shipping?.address.addressLine2}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>city</span>
        <span>{shipping?.address.city}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>state</span>
        <span>{shipping?.address.state}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>Postal code</span>
        <span>{shipping?.address.postalCode}</span>
      </div>
      <div className={styles["shipping-info_group"]}>
        <span>Country</span>
        <span>{shipping?.address.countryCode}</span>
      </div>
    </div>
  );
}
