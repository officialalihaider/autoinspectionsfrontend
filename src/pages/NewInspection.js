import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChecklistSection,
  RatingsSection,
} from "../components/forms/ChecklistSection";
import CarDiagram from "../components/common/CarDiagram";
import { inspectionAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const EXT = [
  "Radiator",
  "Right Strut Tower Apron",
  "Right Front Rail",
  "Left Strut Tower Apron",
  "Left Front Rail",
  "Radiator Core Support",
  "Cowl Panel Firewall",
  "Terminal Condition",
  "Wiring Harness",
  "Hoses",
  "Fan/AC Belts",
  "Pulleys",
  "Head Lights/Fog Lights",
  "Bonnet",
  "Front Right Fender",
  "Front Right Door",
  "Rear Right Door",
  "Rear Right Fender",
  "Boot Trunk",
  "Boot Floor",
  "Boot Lock Pillar",
  "Tail Lights",
  "Floor Deck",
  "Ladder Frame",
  "Rear Left Fender",
  "Rear Left Door",
  "Front Left Door",
  "Front Left Fender",
  "Roof",
  "Pillars",
  "Door Handles",
  "Front Screen",
  "Rear Screen",
  "Wipers",
  "Power Windows",
  "Windows Glass",
  "Front Sub Frame",
  "Rear Sub Frame",
  "Sunroof",
  "Side Mirrors",
];
const INT = [
  "Floor Mat",
  "Roof",
  "Seats Covers",
  "Instrument Cluster",
  "Seat Belts",
  "Dashboard Condition",
  "Climate Control Panel",
  "Master Control Panel",
  "Glove Box",
];
const ELEC = [
  "Battery Low Warning Light",
  "Computer Check Up",
  "ABS Warning Light",
  "Power Steering Warning",
  "Air Bag Warning Light",
  "Oil Pressure Warning",
  "Engine Check Light",
  "Temperature Warning Gauge",
];
const MECH = [
  "Test Drive",
  "Engine Pick",
  "Clutch Operation",
  "Gear Shifting",
  "Suspensions Noise",
  "Engine Noise",
  "Drive Shaft Noise",
  "Brake Pedal Operation",
  "Differential Oil Leakage",
  "4x4 Shifting",
  "ABS Operation",
  "Engine Oil Leakage",
  "Transmission Oil Leakage",
  "Transfer Case Oil Leakage",
  "Coolant Leakage",
  "Brake Oil Leakage",
  "Power Steering Oil Leakage",
  "Engine Blow",
  "Engine Vibration",
  "Engine Mounts",
  "Parking/Hand Brake",
  "Exhaust Sound",
  "Front Propeller Shaft",
  "Rear Propeller Shaft",
  "Differential Noise",
  "Suction Fan",
];
const HEAT = ["Blower", "Heating", "Cooling"];
const TYRES = [
  "Tyre Size",
  "Front Right Tyre",
  "Rear Right Tyre",
  "Rear Left Tyre",
  "Front Left Tyre",
  "Tie Rod End",
  "Boots",
  "Shocks",
  "Suspension",
  "Rims",
];

const mk = (names) =>
  names.map((n) => ({ name: n, status: "na", remarks: "" }));
const STEPS = [
  { id: 0, label: "Vehicle", icon: "🚗" },
  { id: 1, label: "Diagram", icon: "🗺️" },
  { id: 2, label: "Exterior", icon: "🔧" },
  { id: 3, label: "Interior", icon: "🪑" },
  { id: 4, label: "Electrics", icon: "⚡" },
  { id: 5, label: "Mechanic", icon: "⚙️" },
  { id: 6, label: "Heating", icon: "❄️" },
  { id: 7, label: "Tyres", icon: "🛞" },
  { id: 8, label: "Ratings", icon: "⭐" },
];

const init = () => ({
  vehicleMake: "",
  vehicleModel: "",
  modelYear: "",
  engineCapacity: "",
  chassisNo: "",
  registrationNo: "",
  exteriorColor: "",
  transmissionType: "manual",
  driveType: "2wd",
  engineType: "petrol",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  inspectionDate: new Date().toISOString().split("T")[0],
  inspectorName: "",
  inspectorSign: "",
  inspectorStamp: "",
  notes: "",
  status: "draft",
  diagramZones: {},
  exteriorDetails: mk(EXT),
  interiorComfort: mk(INT),
  electrical: mk(ELEC),
  mechanical: mk(MECH),
  heatingCooling: mk(HEAT),
  tyresShocks: mk(TYRES),
  ratings: {
    exterior: 5,
    interior: 5,
    electrical: 5,
    mechanical: 5,
    heatingCooling: 5,
    tyresShocks: 5,
    overall: 5,
  },
});

// ✅ FI and FS moved OUTSIDE component to fix uncontrolled input issue
const FI = ({
  label,
  fk,
  type = "text",
  placeholder = "",
  col = "col-12 col-sm-6 col-md-4",
  form,
  setF,
}) => (
  <div className={col}>
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        value={form[fk] || ""}
        onChange={(e) => setF(fk, e.target.value)}
      />
    </div>
  </div>
);

const FS = ({
  label,
  fk,
  opts,
  col = "col-12 col-sm-6 col-md-4",
  form,
  setF,
}) => (
  <div className={col}>
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={form[fk] || ""}
        onChange={(e) => setF(fk, e.target.value)}
      >
        {opts.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default function NewInspection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setSt] = useState(0);
  const [saving, setSv] = useState(false);
  const [form, setForm] = useState(init);

  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
      toast.error("Admin access required");
    }
  }, [user]);

  // ── Controlled field update (no re-click issue) ──
  const setF = useCallback((k, v) => setForm((p) => ({ ...p, [k]: v })), []);
  const updateList = useCallback(
    (lk) => (idx, f, v) =>
      setForm((p) => ({
        ...p,
        [lk]: p[lk].map((it, i) => (i === idx ? { ...it, [f]: v } : it)),
      })),
    [],
  );
  const setRating = useCallback(
    (k, v) => setForm((p) => ({ ...p, ratings: { ...p.ratings, [k]: v } })),
    [],
  );
  const diagZone = useCallback((z) => {
    if (z.newStatus !== undefined)
      setForm((p) => ({
        ...p,
        diagramZones: { ...p.diagramZones, [z.id]: z.newStatus },
      }));
  }, []);

  const save = async (status) => {
    if (!form.vehicleMake.trim()) {
      toast.error("Vehicle Make is required!");
      setSt(0);
      return;
    }
    setSv(true);
    try {
      const r = await inspectionAPI.create({ ...form, status });
      toast.success(
        status === "completed" ? "✅ Inspection completed!" : "💾 Draft saved!",
      );
      navigate(`/view/${r.data.data._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    } finally {
      setSv(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div
              className="card mb-4"
              style={{ borderLeft: "4px solid var(--primary)" }}
            >
              <div className="card-header">
                <span style={{ fontSize: "22px" }}>🚗</span> Vehicle Information
              </div>
              <div className="card-body">
                <div className="row g-0">
                  <FI
                    label="Vehicle Make *"
                    fk="vehicleMake"
                    placeholder="Toyota, Honda, Suzuki..."
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Model"
                    fk="vehicleModel"
                    placeholder="Corolla, Civic, Alto..."
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Model Year"
                    fk="modelYear"
                    placeholder="2020"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Engine Capacity"
                    fk="engineCapacity"
                    placeholder="1300cc, 1800cc"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Chassis No."
                    fk="chassisNo"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Registration No."
                    fk="registrationNo"
                    placeholder="ABC-123"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Color"
                    fk="exteriorColor"
                    placeholder="White, Silver..."
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Inspection Date"
                    fk="inspectionDate"
                    type="date"
                    form={form}
                    setF={setF}
                  />
                  <FS
                    label="Transmission"
                    fk="transmissionType"
                    opts={[
                      ["manual", "Manual"],
                      ["automatic", "Automatic"],
                    ]}
                    form={form}
                    setF={setF}
                  />
                  <FS
                    label="Drive Type"
                    fk="driveType"
                    opts={[
                      ["2wd", "2WD"],
                      ["4wd", "4WD"],
                      ["awd", "AWD"],
                    ]}
                    form={form}
                    setF={setF}
                  />
                  <FS
                    label="Engine/Fuel Type"
                    fk="engineType"
                    opts={[
                      ["petrol", "Petrol"],
                      ["diesel", "Diesel"],
                      ["cng", "CNG"],
                      ["electric", "Electric"],
                      ["hybrid", "Hybrid"],
                    ]}
                    form={form}
                    setF={setF}
                  />
                </div>
              </div>
            </div>
            <div
              className="card mb-4"
              style={{ borderLeft: "4px solid #448aff" }}
            >
              <div className="card-header">
                <span style={{ fontSize: "22px" }}>👤</span> Customer Details
              </div>
              <div className="card-body">
                <div className="row g-0">
                  <FI
                    label="Customer Name"
                    fk="customerName"
                    placeholder="Full name"
                    col="col-12 col-sm-6"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Phone Number"
                    fk="customerPhone"
                    placeholder="+92 300 0000000"
                    col="col-12 col-sm-6"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Customer Email"
                    fk="customerEmail"
                    type="email"
                    placeholder="customer@email.com"
                    col="col-12"
                    form={form}
                    setF={setF}
                  />
                </div>
                <div
                  className="alert alert-warning py-2 px-3 mb-0"
                  style={{ fontSize: "13px" }}
                >
                  ⚠️ <strong>Important:</strong> Customer email is required for
                  the customer to login and view their inspection report.
                </div>
              </div>
            </div>
            <div
              className="card mb-4"
              style={{ borderLeft: "4px solid var(--warn)" }}
            >
              <div className="card-header">
                <span style={{ fontSize: "22px" }}>🔍</span> Inspector Details
              </div>
              <div className="card-body">
                <div className="row g-0">
                  <FI
                    label="Inspector Name"
                    fk="inspectorName"
                    placeholder="Inspector full name"
                    col="col-12 col-sm-6 col-md-4"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Signature (text)"
                    fk="inspectorSign"
                    placeholder="e.g. Ali Haider"
                    col="col-12 col-sm-6 col-md-4"
                    form={form}
                    setF={setF}
                  />
                  <FI
                    label="Stamp / Badge No."
                    fk="inspectorStamp"
                    placeholder="e.g. AG-001"
                    col="col-12 col-sm-6 col-md-4"
                    form={form}
                    setF={setF}
                  />
                </div>
              </div>
            </div>
            <div className="card" style={{ borderLeft: "4px solid var(--ok)" }}>
              <div className="card-header">
                <span style={{ fontSize: "22px" }}>📝</span> Inspector Notes
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Additional observations, test drive notes..."
                  value={form.notes}
                  onChange={(e) => setF("notes", e.target.value)}
                />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <div>
            <div className="car-diagram-wrap card">
              <div className="card-body">
                <CarDiagram zones={form.diagramZones} onZoneClick={diagZone} />
              </div>
            </div>
            <div
              className="alert alert-danger mt-3"
              style={{ fontSize: "14px" }}
            >
              💡 Click any zone on the car to mark it <strong>OK ✓</strong> or{" "}
              <strong>Issue ✗</strong>. This diagram appears in the PDF report.
            </div>
          </div>
        );
      case 2:
        return (
          <ChecklistSection
            title="1. Exterior Details (40 Items)"
            icon="🔧"
            items={form.exteriorDetails}
            onChange={updateList("exteriorDetails")}
          />
        );
      case 3:
        return (
          <ChecklistSection
            title="2. Interior & Comfort"
            icon="🪑"
            items={form.interiorComfort}
            onChange={updateList("interiorComfort")}
          />
        );
      case 4:
        return (
          <ChecklistSection
            title="3. Electrical Systems"
            icon="⚡"
            items={form.electrical}
            onChange={updateList("electrical")}
          />
        );
      case 5:
        return (
          <ChecklistSection
            title="4. Mechanical & Driving"
            icon="⚙️"
            items={form.mechanical}
            onChange={updateList("mechanical")}
          />
        );
      case 6:
        return (
          <ChecklistSection
            title="5. Heating & Cooling"
            icon="❄️"
            items={form.heatingCooling}
            onChange={updateList("heatingCooling")}
            type="heating"
          />
        );
      case 7:
        return (
          <ChecklistSection
            title="6. Tyres & Shocks"
            icon="🛞"
            items={form.tyresShocks}
            onChange={updateList("tyresShocks")}
            type="tyres"
          />
        );
      case 8:
        return <RatingsSection ratings={form.ratings} onChange={setRating} />;
      default:
        return null;
    }
  };

  const pct = Math.round((step / (STEPS.length - 1)) * 100);
  return (
    <div>
      <div className="progress mb-3">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>

      <div className="steps-wrap mb-4">
        <div className="steps-bar">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`step-item ${step === s.id ? "active" : step > s.id ? "done" : ""}`}
              onClick={() => setSt(s.id)}
            >
              <span className="step-icon">{step > s.id ? "✓" : s.icon}</span>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div>
          {step > 0 && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSt((s) => s - 1)}
            >
              ← Back
            </button>
          )}
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <button
            className="btn btn-outline-secondary"
            onClick={() => save("draft")}
            disabled={saving}
          >
            💾 Save Draft
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-danger"
              onClick={() => setSt((s) => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-success btn-lg"
              onClick={() => save("completed")}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-sm me-2" />
                  Saving...
                </>
              ) : (
                "✅ Complete Inspection"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
