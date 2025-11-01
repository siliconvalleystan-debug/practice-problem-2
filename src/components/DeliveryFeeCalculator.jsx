import { useState } from "react";
import { formatCurrency } from "../utils/formatters";

const defaultForm = {
  avgTicketSize: "500",
  commissionRate: "0.25",
  deliveryFeeExpense: "30",
  profitMargin: "0.05",
};

const DeliveryFeeCalculator = () => {
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
              Suggested Delivery Fee for Customer:{" "}
              {formatCurrency(result.deliveryFeeCustomer)}
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
                    Suggested Delivery Fee for Customer:{" "}
                    {formatCurrency(result.deliveryFeeCustomer)}
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

export default DeliveryFeeCalculator;
