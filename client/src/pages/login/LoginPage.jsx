import { Link } from "react-router-dom";

import styles from "./LoginPage.module.scss";

import Container from "../../components/ui/Container";
import Form from "./components/Form";

function LoginPage() {
  return (
    <section id={styles["login-page"]}>
      <div className={styles.brand}>
        <Link replace to="/">
          <img src="/logo.png" alt="logo" className={styles.logo} />
        </Link>
      </div>

      <Container>
        <div className={styles.wrapper}>
          <Form />
        </div>
      </Container>
    </section>
  );
}

export default LoginPage;
