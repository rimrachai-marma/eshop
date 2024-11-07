import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Form.module.scss";

import FormInput from "./FormInput";
import { setShippingAddress } from "../../../redux/shipping-address/shippingAddressSlice";

function isNotEmpty(value) {
  return !(value.length === 0);
}

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state: checkoutItems } = useLocation();
  const { shippingAddress } = useSelector((state) => state.shippingAddress);

  const [enteredShippingAddressInfo, setEnteredShippingAddressInfo] = useState({
    addressLine1: shippingAddress?.addressLine1 ?? "",
    addressLine2: shippingAddress?.addressLine2 ?? "",
    city: shippingAddress?.city ?? "",
    state: shippingAddress?.state ?? "",
    postalCode: shippingAddress?.postalCode ?? "",
    countryCode: shippingAddress?.countryCode ?? "",
  });
  const [shippingAddressInfoToutched, setShippingAddressInfoToutched] = useState({
    addressLine1: false,
    city: false,
    state: false,
    postalCode: false,
    countryCode: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEnteredShippingAddressInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleBlur = (event) => {
    const name = event.target.name;
    setShippingAddressInfoToutched((prevValue) => {
      return {
        ...prevValue,
        [name]: true,
      };
    });
  };

  ///validation

  // addressLine1
  const enteredAddressLine1IsValied = isNotEmpty(enteredShippingAddressInfo.addressLine1);
  const addressLine1InputIsInvalied = !enteredAddressLine1IsValied && shippingAddressInfoToutched.addressLine1;

  // city
  const enteredCityIsValied = isNotEmpty(enteredShippingAddressInfo.city);
  const cityInputIsInvalied = !enteredCityIsValied && shippingAddressInfoToutched.city;

  // city
  const enteredStateIsValied = isNotEmpty(enteredShippingAddressInfo.state);
  const stateInputIsInvalied = !enteredStateIsValied && shippingAddressInfoToutched.state;

  // postalCode
  const enteredPostalCodeIsValied = isNotEmpty(enteredShippingAddressInfo.postalCode);
  const postalCodeInputIsInvalied = !enteredPostalCodeIsValied && shippingAddressInfoToutched.postalCode;

  // country
  const enteredCountryCodeIsValied = isNotEmpty(enteredShippingAddressInfo.countryCode);
  const countryCodeInputIsInvalied = !enteredCountryCodeIsValied && shippingAddressInfoToutched.countryCode;

  let formIsValid = false;
  if (enteredAddressLine1IsValied && enteredCityIsValied && enteredStateIsValied && enteredPostalCodeIsValied && enteredCountryCodeIsValied) {
    formIsValid = true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      setShippingAddress({
        addressLine1: enteredShippingAddressInfo.addressLine1,
        addressLine2: enteredShippingAddressInfo.addressLine2,
        city: enteredShippingAddressInfo.city,
        state: enteredShippingAddressInfo.state,
        postalCode: enteredShippingAddressInfo.postalCode,
        countryCode: enteredShippingAddressInfo.countryCode,
      })
    );

    setEnteredShippingAddressInfo({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      countryCode: "",
    });
    setShippingAddressInfoToutched({
      addressLine1: false,
      city: false,
      state: false,
      postalCode: false,
      countryCode: false,
    });

    navigate("/checkout", {
      state: { checkoutItems, shippingAddress: enteredShippingAddressInfo },
    });
  };

  return (
    <div className={styles["shipping-form"]}>
      <h1>shipping to</h1>

      <form onSubmit={handleSubmit}>
        <FormInput
          name="addressLine1"
          label="address line 1"
          id="addressLine1"
          htmlFor="addressLine1"
          type="text"
          placeholder="1600 Amphitheatre Parkway"
          value={enteredShippingAddressInfo.addressLine1}
          onChange={handleChange}
          onBlur={handleBlur}
          error={addressLine1InputIsInvalied}
          errorMassage="Address line 1 must not be empty!"
        />
        <FormInput
          name="addressLine2"
          label="address line 2 (optional)"
          id="addressLine2"
          htmlFor="addressLine2"
          type="text"
          placeholder="Apartment 1"
          value={enteredShippingAddressInfo.addressLine2}
          onChange={handleChange}
        />

        <div className={styles.wrapper}>
          <FormInput
            name="countryCode"
            label="country code"
            id="countryCode"
            htmlFor="countryCode"
            type="text"
            placeholder="US"
            value={enteredShippingAddressInfo.countryCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={countryCodeInputIsInvalied}
            errorMassage="Country code must not be empty!"
          />

          <FormInput
            name="state"
            label="state"
            id="state"
            htmlFor="state"
            type="text"
            placeholder="CA"
            value={enteredShippingAddressInfo.state}
            onChange={handleChange}
            onBlur={handleBlur}
            error={stateInputIsInvalied}
            errorMassage="State must not be empty!"
          />
        </div>

        <div className={styles.wrapper}>
          <FormInput
            name="city"
            label="city"
            id="city"
            htmlFor="city"
            type="text"
            placeholder="Mountain View"
            value={enteredShippingAddressInfo.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={cityInputIsInvalied}
            errorMassage="City must not be empty!"
          />
          <FormInput
            name="postalCode"
            label="postal code"
            id="postalCode"
            htmlFor="postalCode"
            type="number"
            placeholder="94043"
            value={enteredShippingAddressInfo.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={postalCodeInputIsInvalied}
            errorMassage="Postal code must not be empty!"
          />
        </div>

        <button disabled={!formIsValid}>continue</button>
      </form>
    </div>
  );
}

export default Form;
