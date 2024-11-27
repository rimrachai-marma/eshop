import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Protected from "./components/protected-route/Protected";
import HomePage from "./pages/home/HomePage";
import ProductsPage from "./pages/products/ProductsPage";
import SearchPage from "./pages/search/SearchPage";
import ProductPage from "./pages/product/ProductPage";
import ProductsCategoryPage from "./pages/products-category/ProductsCategoryPage";
import Review from "./pages/product/components/Review";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import CartPage from "./pages/cart/CartPage";
import ShippingPage from "./pages/shipping/ShippingPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import AuthPageLayout from "./layouts/AuthLayout";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import OrderDetailesPage from "./pages/order/OrderDetailesPage";
import ProfilePageLayout from "./layouts/ProfilePageLayout";
import PersonalInfo from "./pages/profile/PersonalInfo";
import Security from "./pages/profile/Security";
import OrderList from "./pages/profile/OrderList";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPageLayout from "./layouts/AdminDashboardPageLayout";
import Dashboard from "./pages/admin-dashboard/Dashboard";
import Users from "./pages/admin-dashboard/Users";
import Products from "./pages/admin-dashboard/Products";
import Orders from "./pages/admin-dashboard/Orders";
import ProtectedAsAdmin from "./components/protected-route/ProtectedAsAdmin";
import CreateCategoryPage from "./pages/category-create/CreateCategoryPage";
import CategoyPage from "./pages/category/CategoyPage";
import UserPage from "./pages/user/UserPage";
import Categories from "./pages/admin-dashboard/Categories";
import CreateProductPage from "./pages/create-product/CreateProductPage";
import AdminProductPage from "./pages/admin-product/AdminProductPage";
import AdminOrderDetailesPage from "./pages/admin-order/AdminOrderDetailesPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />

        <Route path="products" element={<ProductsPage />} />

        <Route path="products/search/:keyword" element={<SearchPage />} />

        <Route
          path="products/category/:category"
          element={<ProductsCategoryPage />}
        />

        <Route path="products/:id" element={<ProductPage />}>
          <Route path="review" element={<Review />} />
        </Route>

        <Route path="cart" element={<CartPage />} />

        <Route
          path="shipping"
          element={
            <Protected>
              <ShippingPage />
            </Protected>
          }
        />

        <Route
          path="checkout"
          element={
            <Protected>
              <CheckoutPage />
            </Protected>
          }
        />

        <Route
          path="orders/:id"
          element={
            <Protected>
              <OrderDetailesPage />
            </Protected>
          }
        />

        <Route
          path="profile"
          element={
            <Protected>
              <ProfilePageLayout />
            </Protected>
          }
        >
          <Route index element={<PersonalInfo />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="security" element={<Security />} />
        </Route>
      </Route>

      <Route
        path="admin"
        element={
          <Protected>
            <ProtectedAsAdmin>
              <AdminLayout />
            </ProtectedAsAdmin>
          </Protected>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<AdminDashboardPageLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        <Route path="products/:id" element={<AdminProductPage />} />
        <Route path="users/:id" element={<UserPage />} />
        <Route path="categories/create" element={<CreateCategoryPage />} />
        <Route path="categories/:id" element={<CategoyPage />} />
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailesPage />} />
      </Route>

      <Route element={<AuthPageLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
