import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Loading from "./components/Loading";
import "./components/PageTransition.css";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ViewToBuy from "./pages/ViewToBuy";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-vh-100 d-flex flex-column">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <main className="flex-fill">
                      <Suspense
                        fallback={<Loading fullScreen text="Loading page..." />}
                      >
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <PageTransition>
                                <Home />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/about"
                            element={
                              <PageTransition>
                                <About />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/products"
                            element={
                              <PageTransition>
                                <Products />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/product/:id"
                            element={
                              <PageTransition>
                                <ProductDetail />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/contact"
                            element={
                              <PageTransition>
                                <Contact />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/view-to-buy"
                            element={
                              <PageTransition>
                                <ViewToBuy />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/wishlist"
                            element={
                              <PageTransition>
                                <Wishlist />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/login"
                            element={
                              <PageTransition>
                                <Login />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/signup"
                            element={
                              <PageTransition>
                                <Signup />
                              </PageTransition>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <PageTransition>
                                <UserProfile />
                              </PageTransition>
                            }
                          />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
