// import { useState, useEffect } from "react";
// import API from "../services/api";

// function TrustedContact() {
//   const [contacts, setContacts] = useState([]);
//   const [form, setForm] = useState({ name: "", phone: "" });

//   const fetchContacts = async () => {
//     const res = await API.get("/contacts");
//     setContacts(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await API.post("/contacts", form);
//     setForm({ name: "", phone: "" });
//     fetchContacts();
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   return (
//     <div>
//       <h2>Trusted Contacts</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//         <input name="phone" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
//         <button type="submit">Add</button>
//       </form>

//       <h3>My Contacts</h3>
//       <ul>
//         {contacts.map((c) => (
//           <li key={c._id}>{c.name} - {c.phone}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default TrustedContact;

import { useState, useEffect } from "react";
import API from "../services/api";

function TrustedContact() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [role, setRole] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts");
      setContacts(res.data);

      const user = JSON.parse(localStorage.getItem("user"));
      setRole(user?.role || "student");
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/contacts", form);
      setForm({ name: "", phone: "" });
      fetchContacts();
    } catch {
      alert("Failed to add contact");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const isManagementRole = role === "admin" || role === "mentor";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/MannMitra.png" alt="Logo" className="w-8 h-8" />
        <h2 className="text-2xl font-bold text-blue-700">Emergency Contacts</h2>
      </div>

      {/* Add Contact Form (Mentors/Admins only) */}
      {isManagementRole && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Add an Emergency Contact</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Contact Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-bold"
            >
              Add Contact
            </button>
          </form>
        </div>
      )}

      {/* Contact List */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">Available Contacts</h3>
        {contacts.length > 0 ? (
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li
                key={c._id}
                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{c.name}</span>
                  <span className="text-sm text-gray-500">{c.phone}</span>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition"
                >
                  Call
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">No emergency contacts listed yet. {isManagementRole ? "Add one above!" : "Please contact your mentor if you need assistance."} 🌿</p>
        )}
      </div>
    </div>
  );
}

export default TrustedContact;