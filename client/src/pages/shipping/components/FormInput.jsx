import styles from "./FormInput.module.scss";

function FormInput(props) {
  return (
    <div className={props?.error ? `${styles["form-group"]} ${styles.invalid}` : `${styles["form-group"]}`}>
      <label htmlFor={props.htmlFor}>{props.label}</label>

      <input
        name={props.name}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onBlur={props?.onBlur}
      />
      {props.error && <div className={styles["invalid-massage"]}>{props?.errorMassage}</div>}
    </div>
  );
}

export default FormInput;
