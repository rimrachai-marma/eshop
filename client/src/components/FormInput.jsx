import styles from "./FormInput.module.scss";

const FormInput = (props) => {
  return (
    <div
      className={
        props.error
          ? `${styles["form-group"]} ${styles.invalid}`
          : props.valid
          ? `${styles["form-group"]} ${styles.valid}`
          : `${styles["form-group"]}`
      }
    >
      {props.error && (
        <div className={styles["invalid-massage"]}>{props.errorMassage}</div>
      )}
      <input
        name={props.name}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
        onBlur={props.handleBlur}
      />
      <label>{props.label}</label>
    </div>
  );
};

export default FormInput;
