import styles from "./Error.module.scss";

const Error = ({ message }) => {
  // if (!message) return null;

  return <div className={styles.error}>{message} There is an error!</div>;
};

export default Error;
