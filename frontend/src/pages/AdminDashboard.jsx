import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import toast, { Toaster } from "react-hot-toast";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUD_NAME
}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// console.log(CLOUDINARY_UPLOAD_PRESET);

const SECTIONS = [
  { key: "addProduct", label: "Add Product" },
  { key: "products", label: "All Products" },
  { key: "users", label: "Users" },
  { key: "orders", label: "Orders" },
];

function DeleteModal({ isOpen, onClose, onConfirm, productName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Product</h3>
        <p>Are you sure you want to delete "{productName}"?</p>
        <p className="modal-warning">This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProductModal({ isOpen, onClose, product, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
      });
      setImagePreview(product.image || "");
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const uploadRes = await axios.post(CLOUDINARY_URL, data);
        imageUrl = uploadRes.data.secure_url;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}`,
        { ...formData, image: imageUrl },
        { withCredentials: true }
      );

      if (response.status === 200) {
        onUpdate();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-product-modal">
        <h3>Edit Product</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Name</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-price">Price</label>
            <input
              type="number"
              id="edit-price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-category">Category</label>
            <input
              type="text"
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-stock">Stock</label>
            <input
              type="number"
              id="edit-stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-image">Product Image</label>
            <input
              type="file"
              id="edit-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="modal-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button save"
              disabled={uploading}
            >
              {uploading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [section, setSection] = useState("addProduct");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    product: null,
  });

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {}
  };
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (err) {}
  };
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {}
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setUploading(true);
    let imageUrl = "";
    try {
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const uploadRes = await axios.post(CLOUDINARY_URL, data);
        imageUrl = uploadRes.data.secure_url;
      } else {
        setError("Please select an image to upload.");
        setUploading(false);
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        { ...formData, image: imageUrl },
        { withCredentials: true }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          image: "",
          category: "",
          stock: "",
        });
        setImageFile(null);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${deleteModal.productId}`,
        { withCredentials: true }
      );
      setSuccess("Product deleted successfully!");
      setDeleteModal({ isOpen: false, productId: null, productName: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleEditProduct = (product) => {
    setEditModal({
      isOpen: true,
      product,
    });
  };

  const handleProductUpdate = () => {
    fetchProducts();
    setEditModal({ isOpen: false, product: null });
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-dashboard-sidebar">
        <div className="admin-dashboard-sidebar-title">Admin Panel</div>
        <nav className="admin-dashboard-sidebar-nav">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`admin-dashboard-sidebar-link${
                section === s.key ? " active" : ""
              }`}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="admin-dashboard-main">
        {section === "addProduct" && (
          <>
            <h1 className="admin-dashboard-section-title">Add Product</h1>
            <h2 className="admin-dashboard-subtitle">Add a New Product</h2>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            <form className="admin-product-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="admin-submit-button"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Product"}
              </button>
            </form>
          </>
        )}
        {section === "products" && (
          <>
            <h1 className="admin-dashboard-section-title">All Products</h1>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="admin-table-wrapper">
              {products.length === 0 ? (
                <div className="no-data-message">
                  <p>No products found</p>
                  <p className="no-data-subtext">
                    Add your first product using the "Add Product" section
                  </p>
                </div>
              ) : (
                <table className="admin-products-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>{p._id}</td>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.stock}</td>
                        <td>{p.category}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() => handleEditProduct(p)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <DeleteModal
              isOpen={deleteModal.isOpen}
              onClose={() =>
                setDeleteModal({
                  isOpen: false,
                  productId: null,
                  productName: "",
                })
              }
              onConfirm={confirmDelete}
              productName={deleteModal.productName}
            />
            <EditProductModal
              isOpen={editModal.isOpen}
              onClose={() => setEditModal({ isOpen: false, product: null })}
              product={editModal.product}
              onUpdate={handleProductUpdate}
            />
          </>
        )}
        {section === "users" && (
          <>
            <h1 className="admin-dashboard-section-title">All Users</h1>
            <div className="admin-table-wrapper">
              {users.length === 0 ? (
                <div className="no-data-message">
                  <p>No users found</p>
                  <p className="no-data-subtext">
                    Users will appear here once they register
                  </p>
                </div>
              ) : (
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u._id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
        {section === "orders" && (
          <>
            <h1 className="admin-dashboard-section-title">All Orders</h1>
            <div className="admin-table-wrapper">
              {orders.length === 0 ? (
                <div className="no-data-message">
                  <p>No orders found</p>
                  <p className="no-data-subtext">
                    Orders will appear here once customers make purchases
                  </p>
                </div>
              ) : (
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.user?.email || order.user?._id || "N/A"}</td>
                        <td>
                          <ul>
                            {order.items.map((item) => (
                              <li key={item._id}>
                                {item.product?.name || "Unknown"} x{" "}
                                {item.quantity} @ ${item.price}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>${order.total}</td>
                        <td>{order.status}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
}

export default AdminDashboard;
