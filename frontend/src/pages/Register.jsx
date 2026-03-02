// import { useState } from "react";
// import { register } from "../services/authService";

// function Register() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [msg, setMsg] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await register(form);
//       setMsg("Registered successfully! Token: " + data.token);
//     } catch (err) {
//       setMsg("Error: " + err.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Name" onChange={handleChange} />
//         <input name="email" placeholder="Email" onChange={handleChange} />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} />
//         <button type="submit">Register</button>
//       </form>
//       <p>{msg}</p>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import { register } from "../services/authService";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(form);
      setMsg("Registered successfully! Token: " + data.token);
    } catch (err) {
      setMsg("Error: " + err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <img src="public/MannMitra.png" alt="Logo" className="w-10 h-10 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center text-blue-600">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">{msg}</p>
      </div>
    </div>
  );
}

export default Register;
