import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [formData, setFormData] = useState({ product: '', price: '' });
  const [gotData, setGotData] = useState([]);
  const [editProduct, setEditProduct] = useState(null);  // For managing the product to edit
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');

  // Post Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/";
    const postData = async (url, formData) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(`HTTP Error, Status Code: ${response.status}`);
        }
        await response.json();
        fetchData();  // Refresh the data after posting
      } catch (error) {
        console.error('Fetch error', error);
      }
    };
    postData(url, formData);
  };

  // Get Data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/");
      if (!response.ok) {
        throw new Error(`HTTP Error, Status Code: ${response.status}`);
      }
      const getResult = await response.json();
      setGotData(getResult);
    } catch (error) {
      console.error("Found Error: ", error);
    }
  };

  useEffect(() => {
    fetchData();  // Fetch data on initial load
  }, []);

  // Handle Edit Button Click
  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditedName(product.product);
    setEditedPrice(product.price);
  };

  // Handle Update
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: editedName, price: editedPrice }),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        setEditProduct(null);  // Close the modal
        fetchData();  // Refresh the data after updating
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Product deleted successfully!');
          fetchData();  // Refresh the data after deletion
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  return (
    <>
      <h2>Product and Price App</h2>

      <form onSubmit={handleSubmit}>
        <label>Product Name:
          <input type="text" onChange={(e) => setFormData({ ...formData, product: e.target.value })} />
        </label> &nbsp;
        <label> Price:
          <input type="number" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        </label> &nbsp;
        <button type="submit">Submit</button>
      </form>
      <br /> <br />
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Actions</th>  {/* Actions column for editing and deleting */}
          </tr>
        </thead>
        <tbody>
          {gotData.map((row) => (
            <tr key={row.id}>
              <td><Link to={'/'}>{row.id}</Link></td>
              <td>{row.product}</td>
              <td>{row.price}</td>
              <td>
                <button onClick={() => handleEditClick(row)}>Edit</button>  {/* Edit button */}
                <button onClick={() => handleDelete(row.id)}>Delete</button>  {/* Delete button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (  // Modal for editing
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '1px solid black' }}>
          <h3>Edit Product</h3>
          <label>
            Product Name:
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}  // Handle name change
            />
          </label>
          <br />
          <label>
            Price:
            <input
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}  // Handle price change
            />
          </label>
          <br />
          <button onClick={() => handleUpdate(editProduct.id)}>Update</button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>  {/* Close modal */}
        </div>
      )}
    </>
  );
}

export default App;
