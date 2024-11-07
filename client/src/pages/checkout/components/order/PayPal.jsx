import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "axios";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import cartSlice from "../../../../redux/cart/cartSlice";
import ErrorMessage from "../../../../components/ui/ErrorMessage";

export default function PayPal({ orderinfo }) {
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    const fetchClienId = async () => {
      const { data } = await axios.get("/api/config/paypal_client_id");
      setClientId(data);
    };
    fetchClienId();
  }, []);

  const options = {
    "client-id": clientId,
  };

  return (
    clientId && (
      <PayPalScriptProvider options={options}>
        <ButtonWrapper orderinfo={orderinfo} />
      </PayPalScriptProvider>
    )
  );
}

function ButtonWrapper({ orderinfo }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [{ isPending }] = usePayPalScriptReducer();
  const [error, setError] = useState("");

  const createOrder = async () => {
    setError("");
    try {
      const data = (
        await axios.post(
          "/api/orders/create/paypal",
          {
            orderItems: orderinfo.checkoutItems,
            shippingAddress: orderinfo.shippingAddress,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).data;

      console.log("order_create_data:", data);
      return data.id;
    } catch (error) {
      console.log("order_create_error:", error);

      setError(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  };

  const onApprove = async (data) => {
    try {
      const res = await axios.post(
        "/api/orders/capture/paypal",
        { orderID: data.orderID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(cartSlice.actions.clearCartItems());
      navigate("/orders/" + res.data.orderId);

      console.log("Order_capture_response:", res);
    } catch (error) {
      console.log("order_capture_error:", error);

      setError(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  };

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isPending && <LoadingSpinner />}

      <PayPalButtons disabled={false} createOrder={createOrder} onApprove={onApprove} />
    </>
  );
}
