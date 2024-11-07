import { Link } from "react-router-dom";

import styles from "./RegisterPage.module.scss";

import Container from "../../components/ui/Container";
import Form from "./components/Form";

function RegisterPage() {
  return (
    <section id={styles["register-page"]}>
      <div className={styles.brand}>
        <Link replace to="/">
          <img src="/logo.png" alt="logo" className={styles.logo} />
        </Link>
      </div>

      <Container>
        <div className={styles.register}>
          <Form />
        </div>
      </Container>
    </section>
  );
}

export default RegisterPage;
