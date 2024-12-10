// const endpoint_url =
//   process.env.NODE_ENV === "production"
//     ? "https://api-m.paypal.com"
//     : "https://api-m.sandbox.paypal.com";

const endpoint_url = "https://api-m.sandbox.paypal.com";
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;

const get_access_token = async () => {
  const token = Buffer.from(client_id + ":" + client_secret).toString("base64");

  const url = endpoint_url + "/v1/oauth2/token";
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + token,
    },
    body: "grant_type=client_credentials",
  };

  return (await fetch(url, config)).json();
};

module.exports.create_order = async (schema) => {
  const { token_type, access_token } = await get_access_token();

  const data = {
    intent: schema.intent,
    purchase_units: schema.purchase_units,
  };

  if (schema.payer) {
    data.payer = schema.payer;
  }
  if (schema.payment_source) {
    data.payer = schema.payment_source;
  }
  if (schema.application_context) {
    data.payer = schema.application_context;
  }

  const url = endpoint_url + "/v2/checkout/orders";
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token_type} ${access_token}`,
    },
    body: JSON.stringify(data),
  };

  return (await fetch(url, config)).json();
};

module.exports.capture_order = async (id) => {
  const { token_type, access_token } = await get_access_token();

  const url = `${endpoint_url}/v2/checkout/orders/${id}/capture`;
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token_type} ${access_token}`,
    },
  };

  return (await fetch(url, config)).json();
};

module.exports.get_order_details = async (id) => {
  const { token_type, access_token } = await get_access_token();

  const url = `${endpoint_url}/v2/checkout/orders/${id}`;
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token_type} ${access_token}`,
    },
  };

  return (await fetch(url, config)).json();
};
