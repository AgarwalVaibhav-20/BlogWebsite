import { useState } from "react";
import axios from "axios";
export function InputOTPForm() {

  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const handlePinChange = (index, value, event) => {
    if (/^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`).focus();
      } else if (!value && event.key === "Backspace" && index > 0) {
        document.getElementById(`pin-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const pinValue = pin.join("");
    if (pinValue.length !== 4) {
      setError("Please enter a 4-digit one-time password");
      return;
    }
    setError("");
    alert(`OTP Submitted: ${pinValue}`);

    try {
      const response = await axios.post('/authentication/verification');
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-gray-400 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semobold text-black mb-2">
              Authentication
            </h2>
            <p className="text-gray-800 text-sm mb-6">
              Enter the 4-digit verification code
            </p>
          </div>

          <div className="flex justify-center space-x-2 mb-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value, e)}
                onKeyDown={(e) => handlePinChange(index, e.target.value, e)}
                className="w-12 h-14 text-center text-xl border-2 border-gray-500 rounded-lg 
                  focus:outline-none focus:ring-2 
                   transition-all"
                pattern="[0-9]*"
                inputMode="numeric"
              />
            ))}
          </div>

          {error && (
            <div className="text-red-700 text-center text-sm mb-4">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0a0908] text-white py-3 rounded-lg 
              hover:bg-gray-800 transition-colors duration-300 
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
          >
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputOTPForm;
