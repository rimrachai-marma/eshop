import { useLocation } from "react-router-dom";
import Container from "../../components/ui/Container";
import Form from "./components/Form";

import styles from "./Shipping.module.scss";

function ShippingPage() {
  return (
    <section id={styles["shiping-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <Form />
        </div>
      </Container>
    </section>
  );
}

export default ShippingPage;
