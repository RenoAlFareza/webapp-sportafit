import React, { useState, useRef, useEffect } from "react";

const PinModal = ({ isOpen, onClose, onSubmit, isNewPin = false }) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [step, setStep] = useState(isNewPin ? 1 : 0); // 0: input PIN, 1: create PIN, 2: confirm PIN
  
  const inputRefs = useRef([]);
  const confirmInputRefs = useRef([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", "", "", ""]);
      setConfirmPin(["", "", "", "", "", ""]);
      setError("");
      setStep(isNewPin ? 1 : 0);
      
      // Focus first input when modal opens
      setTimeout(() => {
        if (isNewPin) {
          inputRefs.current[0]?.focus();
        } else {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    }
  }, [isOpen, isNewPin]);

  // Handle input change
  const handleChange = (index, value, isPinConfirm = false) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    // Clear error when user types
    if (error) setError("");
    
    const newPin = isPinConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value.slice(0, 1); // Only take first character
    
    if (isPinConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextRef = isPinConfirm ? confirmInputRefs.current[index + 1] : inputRefs.current[index + 1];
      nextRef?.focus();
    }
    
    // Check if all digits are filled
    if (index === 5 && value && !isPinConfirm && step === 0) {
      // If not creating new PIN, submit immediately
      handleSubmitPin();
    }
  };
  
  // Handle backspace key
  const handleKeyDown = (index, e, isPinConfirm = false) => {
    if (e.key === "Backspace") {
      const currentPin = isPinConfirm ? confirmPin : pin;
      
      // If current input is empty, focus previous input
      if (!currentPin[index] && index > 0) {
        const prevRef = isPinConfirm ? confirmInputRefs.current[index - 1] : inputRefs.current[index - 1];
        prevRef?.focus();
      }
    }
  };
  
  // Handle PIN submission
  const handleSubmitPin = () => {
    const pinString = pin.join("");
    
    // Validate PIN
    if (pinString.length !== 6) {
      setError("Masukkan 6 digit PIN");
      return;
    }
    
    if (step === 0) {
      // Verify existing PIN
      onSubmit(pinString);
    } else if (step === 1) {
      // Move to confirm PIN step
      setStep(2);
      setTimeout(() => {
        confirmInputRefs.current[0]?.focus();
      }, 100);
    } else if (step === 2) {
      // Confirm new PIN
      const confirmPinString = confirmPin.join("");
      
      if (pinString !== confirmPinString) {
        setError("PIN tidak cocok. Silakan coba lagi.");
        setConfirmPin(["", "", "", "", "", ""]);
        setTimeout(() => {
          confirmInputRefs.current[0]?.focus();
        }, 100);
        return;
      }
      
      // Submit new PIN
      onSubmit(pinString, true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-[90%] max-w-sm p-5 shadow-lg">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 0 ? "Masukkan PIN" : 
             step === 1 ? "Buat PIN Baru" : 
             "Konfirmasi PIN"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === 0 ? "Masukkan 6 digit PIN untuk verifikasi pembayaran Anda" : 
             step === 1 ? "Buat PIN 6 digit baru untuk keamanan transaksi Anda" : 
             "Masukkan kembali PIN yang sama untuk konfirmasi identitas"}
          </p>
        </div>
        
        {/* PIN Input */}
        <div className="mb-5">
          {step !== 2 ? (
            <div className="flex justify-center gap-2">
              {pin.map((digit, index) => (
                <input
                  key={`pin-${index}`}
                  ref={el => inputRefs.current[index] = el}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              {confirmPin.map((digit, index) => (
                <input
                  key={`confirm-pin-${index}`}
                  ref={el => confirmInputRefs.current[index] = el}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleChange(index, e.target.value, true)}
                  onKeyDown={e => handleKeyDown(index, e, true)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>
          )}
          
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleSubmitPin}
            disabled={(step === 0 || step === 1) ? pin.some(d => d === "") : confirmPin.some(d => d === "")}
            className={`flex-1 py-2.5 rounded-lg font-medium ${
              ((step === 0 || step === 1) ? pin.some(d => d === "") : confirmPin.some(d => d === ""))
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            {step === 0 ? "Verifikasi" : step === 1 ? "Lanjutkan" : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
