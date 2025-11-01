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

export default TabButton;
