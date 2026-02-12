import { useEffect, useState } from "react";

const PaymentSuccessModal = ({ onClose }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(2);
    }, 1500);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white w-[95%] max-w-[650px] p-16 rounded-3xl shadow-2xl text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl shadow-md">
          ✓
        </div>

        {/* Dynamic Message */}
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800">
              Payment Successful
            </h2>
            <p className="text-lg text-gray-500 mt-4">
              Your transaction has been completed successfully.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800">
              Order Placed
            </h2>
            <p className="text-lg text-gray-500 mt-4">
              Your order has been placed successfully.
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccessModal;
