import { useState, useEffect } from "react";
import "./App.css";

const BASE_URL = "http://localhost:1818/bookingapi";
//const BASE_URL = import.meta.env.VITE_API_URL + "/bookingapi";




function App() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    numberOfGuests: "",
    location: "",
    bookingDate: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch all bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setMessage("❌ Failed to fetch bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id || !form.name || !form.phone || !form.email || !form.bookingDate) {
      setMessage("⚠️ Please fill all required fields (ID, Name, Phone, Email, Date)");
      return;
    }

    try {
      if (editingId) {
        // Update booking
        const res = await fetch(`${BASE_URL}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Update failed");
        setMessage("✅ Booking updated successfully!");
      } else {
        // Add new booking
        const res = await fetch(`${BASE_URL}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Add failed");
        setMessage("✅ Booking added successfully!");
      }
      setForm({
        id: "",
        name: "",
        phone: "",
        email: "",
        numberOfGuests: "",
        location: "",
        bookingDate: "",
        notes: "",
      });
      setEditingId(null);
      fetchBookings(); // Refresh bookings list
    } catch (err) {
      console.error("Error saving booking:", err);
      setMessage("❌ Failed to save booking.");
    }
  };

  const handleEdit = (id) => {
    const booking = bookings.find((b) => b.id === id);
    setForm(booking);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("🗑️ Booking deleted successfully!");
      fetchBookings(); // Refresh bookings list
    } catch (err) {
      console.error("Error deleting booking:", err);
      setMessage("❌ Failed to delete booking.");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="App">
      <h1>🍽️ Restaurant Table Booking System</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="id" placeholder="Booking ID" value={form.id} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
        <input type="number" name="numberOfGuests" placeholder="Number of Guests" value={form.numberOfGuests} onChange={handleChange} />
        <select name="location" value={form.location} onChange={handleChange} required>
          <option value="">Select Location</option>
          <option value="Rooftop">Rooftop</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Indoor">Indoor</option>
        </select>
        <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} required />
        <textarea name="notes" placeholder="Additional Notes" value={form.notes} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Booking" : "Add Booking"}</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h2>All Bookings</h2>
      {bookings.map((booking) => (
        <div className="booking-item" key={booking.id}>
          <div>
            <h3>#{booking.id} - {booking.name}</h3>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
            <p><strong>Location:</strong> {booking.location}</p>
            <p><strong>Date:</strong> {booking.bookingDate}</p>
            <p><strong>Notes:</strong> {booking.notes}</p>
          </div>
          <div className="buttons">
            <button onClick={() => handleEdit(booking.id)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(booking.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
