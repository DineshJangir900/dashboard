import React, { useState } from "react";
import {
  qcFailures,
  stockMismatch,
  dispatchIssues,
  routeIssues
} from "./data";

function Dashboard() {
  const [view, setView] = useState("home");

  const renderTable = (data) => (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {Object.values(row).map((val, i) => (
              <td key={i}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <div className="header">
        <h1>Exception Management System</h1>
        <p>Monitor and manage operational exceptions in real-time</p>
      </div>

      {view === "home" && (
        <div className="cards">
          <Card
            title="QC Failures"
            desc="Quality control failures"
            onClick={() => setView("qc")}
          />
          <Card
            title="Stock Mismatch"
            desc="Inventory discrepancies"
            onClick={() => setView("stock")}
          />
          <Card
            title="Dispatch Errors"
            desc="Shipping issues"
            onClick={() => setView("dispatch")}
          />
          <Card
            title="Route Issues"
            desc="Delivery route problems"
            onClick={() => setView("route")}
          />
        </div>
      )}

      {view === "qc" && <Section title="QC Failures" data={qcFailures} back={() => setView("home")} />}
      {view === "stock" && <Section title="Stock Mismatch" data={stockMismatch} back={() => setView("home")} />}
      {view === "dispatch" && <Section title="Dispatch Issues" data={dispatchIssues} back={() => setView("home")} />}
      {view === "route" && <Section title="Route Issues" data={routeIssues} back={() => setView("home")} />}
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function Section({ title, data, back }) {
  return (
    <div className="section">
      <button onClick={back}>⬅ Back</button>
      <h2>{title}</h2>
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;