import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HealthInsuranceAd = ({ images }) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const hasSeenAd = sessionStorage.getItem("seenHealthAd");
    if (!hasSeenAd) {
      setTimeout(() => {
        setShowAd(true);
        sessionStorage.setItem("seenHealthAd", "true");
      }, 4000);
    }
  }, []);

  if (!showAd) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }} 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <Card className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Get the Best Health Insurance Today!</h2>
        <p className="text-gray-600 mb-4">Secure your future with affordable and comprehensive coverage.</p>
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <a key={index} href={image.link} target="_blank" rel="noopener noreferrer">
              <img src={image.url} alt={`Banner ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
            </a>
          ))}
        </div>
        <Button className="mt-4 w-full" onClick={() => setShowAd(false)}>Close</Button>
      </Card>
    </motion.div>
  );
};

export default HealthInsuranceAd;
