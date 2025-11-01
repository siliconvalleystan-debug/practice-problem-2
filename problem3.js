const { useState } = React;

const roundUpToNearest50 = (value) => Math.ceil(value / 50) * 50;

const formatCurrency = (value) => `Tk ${Number(value).toLocaleString("en-IN")}`;

const formatPercentage = (value) => `${(Number(value) * 100).toFixed(2)}%`;

const TabButton = ({ isActive, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
      isActive
        ? "text-orange-600 border-orange-500 bg-orange-50"
        : "text-slate-500 border-transparent hover:text-orange-600 hover:border-orange-300"
    }`}
  >
    {children}
  </button>
);

const defaultMinimumForm = {
  avgTicketSize: "500",
  deliveryFeeCustomer: "50",
  commissionRate: "0.25",
  profitMargin: "0.05",
};

const MinimumOrderCalculator = () => {
  const [form, setForm] = useState(defaultMinimumForm);
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = (event) => {
    event.preventDefault();

    const avgTicketSize = parseFloat(form.avgTicketSize);
    const deliveryFeeCustomer = parseFloat(form.deliveryFeeCustomer);
    const commissionRate = parseFloat(form.commissionRate);
    const profitMargin =
      form.profitMargin === "" ? 0.05 : parseFloat(form.profitMargin);

    if (
      [avgTicketSize, deliveryFeeCustomer, commissionRate, profitMargin].some(
        (value) => Number.isNaN(value)
      )
    ) {
      setError("Please enter valid numbers in every field.");
      setResult(null);
      return;
    }

    if (commissionRate + profitMargin <= 0) {
      setError("Commission rate plus profit margin must be greater than 0.");
      setResult(null);
      return;
    }

    const sum = avgTicketSize + deliveryFeeCustomer;
    const rate = commissionRate + profitMargin;
    const rawValue = sum / rate;
    const roundedValue = roundUpToNearest50(rawValue);

    setResult({
      minOrder: roundedValue,
      inputs: {
        avgTicketSize,
        deliveryFeeCustomer,
        commissionRate,
        profitMargin,
      },
      steps: {
        sum,
        rate,
        rawValue: Number(rawValue.toFixed(2)),
        roundedValue,
      },
    });
    setShowDetails(true);
    setError("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Average Ticket Size (Tk)
            </span>
            <input
              name="avgTicketSize"
              type="number"
              step="0.01"
              min="0"
              value={form.avgTicketSize}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Delivery Fee (Customer) (Tk)
            </span>
            <input
              name="deliveryFeeCustomer"
              type="number"
              step="0.01"
              min="0"
              value={form.deliveryFeeCustomer}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Commission Rate (decimal)
            </span>
            <input
              name="commissionRate"
              type="number"
              step="0.01"
              min="0"
              value={form.commissionRate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Profit Margin (decimal)
            </span>
            <input
              name="profitMargin"
              type="number"
              step="0.01"
              min="0"
              value={form.profitMargin}
              onChange={handleChange}
              placeholder="0.05"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </label>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-full bg-orange-500 px-6 py-2 text-white font-medium shadow hover:bg-orange-600 transition-colors"
          >
            Calculate
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-orange-100 border border-orange-200 rounded-2xl shadow-inner p-6 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-lg md:text-xl font-semibold text-orange-900">
              ✅ Free delivery on orders above {formatCurrency(result.minOrder)}
            </p>
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="self-start md:self-auto rounded-full border border-orange-400 px-4 py-1 text-sm font-medium text-orange-700 hover:bg-orange-200 transition-colors"
            >
              {showDetails ? "Hide Calculation Details" : "Show Calculation Details"}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-6 text-slate-700">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Input Summary
                </h2>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    Average Ticket Size:{" "}
                    <span className="font-medium">
                      {formatCurrency(result.inputs.avgTicketSize)}
                    </span>
                  </li>
                  <li>
                    Delivery Fee (Customer):{" "}
                    <span className="font-medium">
                      {formatCurrency(result.inputs.deliveryFeeCustomer)}
                    </span>
                  </li>
                  <li>
                    Commission Rate:{" "}
                    <span className="font-medium">
                      {formatPercentage(result.inputs.commissionRate)}
                    </span>
                  </li>
                  <li>
                    Profit Margin:{" "}
                    <span className="font-medium">
                      {formatPercentage(result.inputs.profitMargin)}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Formula
                </h2>
                <p className="mt-2 text-sm font-mono bg-white/70 rounded-lg px-3 py-2">
                  (Average Ticket Size + Delivery Fee) ÷ (Commission Rate + Profit
                  Margin)
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Substitution
                </h2>
                <p className="mt-2 text-sm font-mono bg-white/70 rounded-lg px-3 py-2">
                  ({result.inputs.avgTicketSize} + {result.inputs.deliveryFeeCustomer}) ÷ (
                  {result.inputs.commissionRate} + {result.inputs.profitMargin})
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Step-by-Step Result
                </h2>
                <div className="space-y-1 text-sm font-mono text-slate-600">
                  <p>
                    Step 1: ({result.inputs.avgTicketSize} +{" "}
                    {result.inputs.deliveryFeeCustomer}) = {result.steps.sum.toFixed(2)}
                  </p>
                  <p>
                    Step 2: ({result.inputs.commissionRate} +{" "}
                    {result.inputs.profitMargin}) = {result.steps.rate.toFixed(2)}
                  </p>
                  <p>
                    Step 3: {result.steps.sum.toFixed(2)} ÷ {result.steps.rate.toFixed(2)} ={" "}
                    {result.steps.rawValue.toFixed(2)}
                  </p>
                  <p>
                    Step 4: Round up to nearest 50 -> {formatCurrency(result.steps.roundedValue)}
                  </p>
                  <p className="mt-2 text-base font-semibold text-orange-900">
                    ✅ Minimum Order for Free Delivery: {formatCurrency(result.minOrder)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const defaultDeliveryForm = {
  avgTicketSize: "500",
  commissionRate: "0.25",
  deliveryFeeExpense: "30",
  profitMargin: "0.05",
};

const DeliveryFeeCalculator = () => {
  const [form, setForm] = useState(defaultDeliveryForm);
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = (event) => {
    event.preventDefault();

    const avgTicketSize = parseFloat(form.avgTicketSize);
    const commissionRate = parseFloat(form.commissionRate);
    const deliveryFeeExpense = parseFloat(form.deliveryFeeExpense);
    const profitMargin =
      form.profitMargin === "" ? 0.05 : parseFloat(form.profitMargin);

    if (
      [avgTicketSize, commissionRate, deliveryFeeExpense, profitMargin].some(
        (value) => Number.isNaN(value)
      )
    ) {
      setError("Please enter valid numbers in every field.");
      setResult(null);
      return;
    }

    const diff = commissionRate - profitMargin;
    const reduction = avgTicketSize * diff;
    const rawResult = deliveryFeeExpense - reduction;
    const wasNegative = rawResult < 0;

    let deliveryFeeCustomer = rawResult;
    if (deliveryFeeCustomer < 0) deliveryFeeCustomer = 0;
    deliveryFeeCustomer = Math.round(deliveryFeeCustomer);

    setResult({
      deliveryFeeCustomer,
      inputs: {
        avgTicketSize,
        commissionRate,
        deliveryFeeExpense,
        profitMargin,
      },
      steps: {
        diff,
        reduction,
        rawResult,
        wasNegative,
      },
    });
    setShowDetails(true);
    setError("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Average Ticket Size (Tk)
            </span>
            <input
              name="avgTicketSize"
              type="number"
              step="0.01"
              min="0"
              value={form.avgTicketSize}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Commission Rate (decimal)
            </span>
            <input
              name="commissionRate"
              type="number"
              step="0.01"
              value={form.commissionRate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Delivery Fee Expense (Tk)
            </span>
            <input
              name="deliveryFeeExpense"
              type="number"
              step="0.01"
              min="0"
              value={form.deliveryFeeExpense}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              Profit Margin (decimal)
            </span>
            <input
              name="profitMargin"
              type="number"
              step="0.01"
              value={form.profitMargin}
              onChange={handleChange}
              placeholder="0.05"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </label>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-full bg-orange-500 px-6 py-2 text-white font-medium shadow hover:bg-orange-600 transition-colors"
          >
            Calculate Delivery Fee
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-orange-100 border border-orange-200 rounded-2xl shadow-inner p-6 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-lg md:text-xl font-semibold text-orange-900">
              ✅ Suggested Delivery Fee for Customer: {formatCurrency(result.deliveryFeeCustomer)}
            </p>
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="self-start md:self-auto rounded-full border border-orange-400 px-4 py-1 text-sm font-medium text-orange-700 hover:bg-orange-200 transition-colors"
            >
              {showDetails ? "Hide Calculation Steps" : "Show Calculation Steps"}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-4 text-slate-700">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Calculation Steps
                </h2>
                <div className="mt-2 space-y-1 text-sm font-mono text-slate-600">
                  <p>
                    Step 1: {result.inputs.commissionRate} - {result.inputs.profitMargin} ={" "}
                    {result.steps.diff.toFixed(2)}
                  </p>
                  <p>
                    Step 2: {result.inputs.avgTicketSize} x {result.steps.diff.toFixed(2)} ={" "}
                    {result.steps.reduction.toFixed(2)}
                  </p>
                  <p>
                    Step 3: {result.inputs.deliveryFeeExpense} - {result.steps.reduction.toFixed(2)} ={" "}
                    {result.steps.rawResult.toFixed(2)}
                    {result.steps.wasNegative ? " -> Adjusted to 0 Tk" : ""}
                  </p>
                  <p className="mt-2 text-base font-semibold text-orange-900">
                    ✅ Suggested Delivery Fee for Customer: {formatCurrency(result.deliveryFeeCustomer)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState("minimum-order");

  const heading =
    activeTab === "minimum-order"
      ? "Minimum Order for Free Delivery Calculator"
      : "Delivery Fee for Customer Calculator";

  return (
    <div className="max-w-4xl mx-auto px-4">
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
