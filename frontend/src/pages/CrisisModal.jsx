function CrisisModal({ onClose }) {
  const helplines = [
    { name: "National Helpline (India)", number: "9152987821" },
    { name: "International Lifeline", number: "+1-800-273-8255" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] relative">
        {/* Logo */}
        <img src="public/MannMitra.png" alt="Logo" className="w-6 h-6 absolute top-4 right-4" />

        <h2 className="text-xl font-bold text-red-600 mb-3">⚠️ Crisis Alert</h2>
        <p className="text-gray-700 mb-4">
          It looks like you may be going through a tough time. You're not alone —
          please consider reaching out:
        </p>

        <ul className="space-y-2 mb-4">
          {helplines.map((h, i) => (
            <li key={i}>
              <span className="font-medium">{h.name}</span>:{" "}
              <a
                href={`tel:${h.number}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {h.number}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CrisisModal;
