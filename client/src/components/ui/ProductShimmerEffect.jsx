import styles from "./ProductShimmerEffect.module.scss";

function ProductShimmerEffect() {
  return (
    <div className={styles.card}>
      <div className={styles["card-header"]}>
        <span></span>
      </div>
      <div className={styles["card-body"]}>
        <span className={styles["card-title"]}></span>

        <span className={styles.rating}></span>
      </div>
      <div className={styles["card-footer"]}>
        <span className={styles.price}></span>
        <span className={styles.btn}></span>
      </div>
      <div className={styles.shimmer}></div>
    </div>
  );
}

export default ProductShimmerEffect;
