/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${getBaseUrl()}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Login successful");

      location.assign("/express-admin");
    } else {
      showAlert("error", "Unexpected response from the server");
    }
  } catch (err) {
    showAlert(
      "error",
      err.response ? err.response.data.message : "Error logging in"
    );
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `${getBaseUrl()}/api/v1/users/logout`,
    });
    if (res.data.status === "success") {
      location.assign("/login");
    }
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${getBaseUrl()}/api/v1/users/signup`,
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      location.assign("/express-admin");
    }

    showAlert("success", "Sign up successful:");
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const formatNumber = (num) => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1) + "T";
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

export const updateSettings = async (data, type) => {
  try {
    let url;
    if (type === "password") {
      url = `${getBaseUrl()}/api/v1/users/updateMyPassword`;
    } else if (type === "data") {
      url = `${getBaseUrl()}/api/v1/users/updateMe`;
    } else if (type === "socials") {
      url = `${getBaseUrl()}/api/v1/socials/update-socials`;
    }
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
      location.reload();
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const createReview = async (data, purchaseSecret) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/v1/reviews?secret=${purchaseSecret}`,
      data
    );
    if (response.data.status === "created") {
      showAlert("success", "Review submitted successfully!");
      location.reload();
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const verifyEmailFn = async (email, itemId) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/v1/purchases/verify-email`,
      {
        email,
        itemId,
      }
    );

    if (response.data.status === "success") {
      const token = response.data.data.token;
      // Redirect user to the download page with the purchase token
      window.location.href = `/payment-success/${token}`;
    } else {
      // Handle the case where no purchase was found
      showAlert("error", "No purchase found with that email for this item.");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        showAlert(
          "error",
          "The token is invalid or has expired. Please request a new one."
        );
      } else {
        showAlert("error", "Something went wrong.");
      }
    } else {
      showAlert("error", "An unexpected error occurred. Please try again.");
    }
    showAlert("error", "Error verifying email:");
  }
};

export const createComment = async (postId, name, email, comment) => {
  try {
    const response = await axios.post(`${getBaseUrl()}/api/v1/comments`, {
      post: postId,
      name,
      email,
      comment,
    });

    if (response.data.status === "created") {
      showAlert("success", "Comment submitted successfully!");
      location.reload(); // Reload the page to show the new comment
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const createContactUs = async (name, email, message, contactForm) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/contact-us`, {
      name,
      email,
      message,
    });

    if (res.data.status === "created") {
      showAlert("success", "Message sent successfully!");
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};

export const createItem = async (formData) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/items`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "created") {
      showAlert("success", "Item created successfully!");
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};

export const addCategory = async (data) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/api/v1/categories`, data);

    if (res.data.status === "created") {
      showAlert("success", "Category added successfully!");
    } else {
      showAlert("error", "Failed to add the category.");
    }
  } catch (err) {
    showAlert("error", "Something went wrong. Please try again.");
  }
};

export const fetchTrafficData = async () => {
  try {
    const url = `${getBaseUrl()}/api`;
    const [
      dailyResponse,
      monthlyResponse,
      allTimeResponse,
    ] = await Promise.all([
      axios.get(`${url}/traffic/daily`),
      axios.get(`${url}/traffic/monthly`),
      axios.get(`${url}/traffic/all-time`),
    ]);

    return {
      dailyCount: dailyResponse.data.dailyCount || 0,
      monthlyCount: monthlyResponse.data.allTimeCount || 0,
      allTimeCount: allTimeResponse.data.monthlyCount || 0,
    };
  } catch (error) {
    showAlert("error", "Error fetching traffic data:", error);
    return {
      dailyCount: 0,
      monthlyCount: 0,
      allTimeCount: 0,
    };
  }
};

export const handlePaymentCallback = async (
  data,
  itemId,
  name,
  email,
  amount
) => {
  const reference = data.tx_ref;

  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/v1/purchases/create-purchase`,
      // `${getBaseUrl()}/api/v1/purchases/webhook`,
      {
        item: itemId,
        buyerName: name,
        buyerEmail: email,
        price: amount,
        paid: true,
      }
    );

    const result = response.data;
    if (result.status === "success") {
      const purchaseId = response.data.data.purchaseId;
      const item = response.data.data.item;
      const buyerEmail = encodeURIComponent(response.data.data.buyerEmail); // Safely encode the email
      showAlert("success", "Payment complete! Reference: " + reference);
      window.location.href = `/redirect/${purchaseId}/${item}/${buyerEmail}`;
    } else {
      showAlert("error", "Error processing payment. Please try again.");
    }
  } catch (error) {
    showAlert("error", "Error processing payment. Please try again.");
  }
};

export const handlePostSubmit = async (
  title,
  content,
  excerpt,
  tags,
  category,
  photo,
  author,
  published,
  type,
  postId = ""
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("excerpt", excerpt);
    formData.append("tags", tags);
    formData.append("category", category);
    if (photo) formData.append("photo", photo);
    formData.append("author", author);
    formData.append("published", published);

    const url =
      type === "create"
        ? `${getBaseUrl()}/api/v1/posts/submit-post`
        : `${getBaseUrl()}/api/v1/posts/${postId}`;

    const method = type === "create" ? "POST" : "PATCH";

    const res = await axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success" || res.data.status === "created") {
      showAlert("success", `Post ${type}d successfully!`);
      location.assign("/admin/admin-posts");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteItem = async (type, id) => {
  try {
    const res = await axios.delete(`${getBaseUrl()}/api/v1/${type}/${id}`);
    if (res.status === 204) {
      showAlert("success", `${type} deleted successfully!`);
      // Optionally, remove the deleted item from the DOM
      const itemElement = document.querySelector(`.${type}[data-id="${id}"]`);
      if (itemElement) {
        itemElement.remove();
      } else {
        showAlert(
          "error",
          `Element with selector .${type}[data-id="${id}"] not found in the DOM.`
        );
      }
    } else {
      showAlert("error", `Failed to delete the ${type}`);
    }
  } catch (err) {
    showAlert("error", `Failed to delete the ${type}`);
  }
};

export const initializeImagePreview = (imgSelector, inputSelector) => {
  const imgElement = document.querySelector(imgSelector);
  const inputElement = document.querySelector(inputSelector);

  if (inputElement) {
    inputElement.addEventListener("change", () => {
      const file = inputElement.files[0];
      if (file) {
        imgElement.src = URL.createObjectURL(file);
      }
    });
  }
};
