import React from "react";
import { RefreshCw } from "lucide-react";

export const DataCard = ({ title, children, onRefresh, loading }) => {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontWeight: 600, color: "var(--text-main)", fontSize: "1.1rem" }}>{title}</h3>
        <button 
          onClick={onRefresh} 
          disabled={loading} 
          className="btn-icon"
          title="Refresh data"
        >
          <RefreshCw size={18} className={loading ? "spin" : ""} color="currentColor" />
        </button>
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
        {children}
      </div>
    </div>
  );
};
