import styles from "./Stripe.module.scss";

export default function Stripe({ orderInfo }) {
  return (
    <button className={styles.btn}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="28"
        viewBox="0 0 36 28"
      >
        <path d="M0 23.5v-9.5h36v9.5c0 1.375-1.125 2.5-2.5 2.5h-31c-1.375 0-2.5-1.125-2.5-2.5zM10 20v2h6v-2h-6zM4 20v2h4v-2h-4zM33.5 2c1.375 0 2.5 1.125 2.5 2.5v3.5h-36v-3.5c0-1.375 1.125-2.5 2.5-2.5h31z"></path>
      </svg>
      Pay
    </button>
  );
}
