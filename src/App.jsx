import { useState } from "react";
import MinimumOrderCalculator from "./components/MinimumOrderCalculator";
import DeliveryFeeCalculator from "./components/DeliveryFeeCalculator";
import TabButton from "./components/TabButton";

const App = () => {
  const [activeTab, setActiveTab] = useState("minimum-order");

  const heading =
    activeTab === "minimum-order"
      ? "Minimum Order for Free Delivery Calculator"
      : "Delivery Fee for Customer Calculator";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 text-center mb-6">
          {heading}
        </h1>
        <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 pb-4 mb-6">
          <TabButton
            isActive={activeTab === "minimum-order"}
            onClick={() => setActiveTab("minimum-order")}
          >
            Minimum Order Threshold
          </TabButton>
          <TabButton
            isActive={activeTab === "delivery-fee"}
            onClick={() => setActiveTab("delivery-fee")}
          >
            Delivery Fee Estimator
          </TabButton>
        </div>

        {activeTab === "minimum-order" ? (
          <MinimumOrderCalculator />
        ) : (
          <DeliveryFeeCalculator />
        )}
      </div>
    </div>
  );
};

export default App;
