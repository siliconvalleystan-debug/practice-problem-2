import { useState } from "react";
import {
  roundUpToNearest50,
  formatCurrency,
  formatPercentage,
} from "../utils/formatters";

const defaultForm = {
  avgTicketSize: "500",
  deliveryFeeCustomer: "50",
  commissionRate: "0.25",
  profitMargin: "0.05",
};

const MinimumOrderCalculator = () => {
  const [form, setForm] = useState(defaultForm);
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

    const deliveryFee = deliveryFeeCustomer;
    const rate = commissionRate + profitMargin;
    const rawValue = deliveryFee / rate;
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
        deliveryFee,
        rate,
        rawValue,
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
              Free delivery on orders above {formatCurrency(result.minOrder)}
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
                  Delivery Fee / (Commission Rate + Profit Margin)
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Substitution
                </h2>
                <p className="mt-2 text-sm font-mono bg-white/70 rounded-lg px-3 py-2">
                  {result.inputs.deliveryFeeCustomer} / (
                  {result.inputs.commissionRate} + {result.inputs.profitMargin})
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Step-by-Step Result
                </h2>
                <div className="space-y-1 text-sm font-mono text-slate-600">
                  <p>
                    Step 1: Delivery Fee = {result.steps.deliveryFee.toFixed(2)}
                  </p>
                  <p>
                    Step 2: ({result.inputs.commissionRate} + {result.inputs.profitMargin}) ={" "}
                    {result.steps.rate.toFixed(2)}
                  </p>
                  <p>
                    Step 3: {result.steps.deliveryFee.toFixed(2)} / {result.steps.rate.toFixed(2)} ={" "}
                    {result.steps.rawValue.toFixed(2)}
                  </p>
                  <p>
                    Step 4: Round up to nearest 50 -> {formatCurrency(result.steps.roundedValue)}
                  </p>
                  <p className="mt-2 text-base font-semibold text-orange-900">
                    Minimum Order for Free Delivery: {formatCurrency(result.minOrder)}
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

export default MinimumOrderCalculator;
