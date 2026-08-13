// src/components/shared/DropletIcon.jsx
// The blood-drop mark used inside the red "HemoAI" logo square, wherever
// that logo appears (sidebar, top bars, landing page, login, certificate).
// A single shared icon so every instance stays visually identical.
export default function DropletIcon({ size = 16, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5c0 0-7 9-7 14a7 7 0 0014 0c0-5-7-14-7-14z"
        fill={color}
      />
    </svg>
  );
}
