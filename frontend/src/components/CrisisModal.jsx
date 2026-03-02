import React from "react";

function CrisisModal({ onClose }) {
  const helplines = [
    { name: "National Helpline (India)", number: "9152987821" },
    { name: "International Lifeline", number: "+1-800-273-8255" },
  ];

  return (
    <div style={{ background: "rgba(0,0,0,0.7)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <div style={{ background: "#fff", margin: "100px auto", padding: "20px", width: "400px", borderRadius: "10px" }}>
        <h2>⚠️ Crisis Alert</h2>
        <p>It looks like you're going through a tough time. Please consider reaching out:</p>
        
        <ul>
          {helplines.map((h, i) => (
            <li key={i}>
              {h.name}: <a href={`tel:${h.number}`}>{h.number}</a>
            </li>
          ))}
        </ul>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CrisisModal;
