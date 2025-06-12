
export const Banner = () => {
  return (
    <div className="bg-base-100 text-base-content shadow-lg border border-base-300 rounded-lg p-4 w-[300px] font-sans">
      <div className="flex items-start gap-3">
        <div className="text-3xl">🧁</div>
        <div className="flex-1">
          <p className="text-sm font-medium">Imperial units detected</p>
          <p className="text-xs text-base-content/60">Convert to Metric?</p>
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => alert("Conversion coming soon")}
        >
          Convert
        </button>
      </div>
    </div>
  )
}