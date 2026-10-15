import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const count = (status) => tasks.filter((t) => t.status === status).length;

  const cards = [
    { label: "Total Tasks", value: tasks.length, color: "primary" },
    { label: "Pending", value: count("Pending"), color: "warning" },
    { label: "In Progress", value: count("In Progress"), color: "info" },
    { label: "Completed", value: count("Completed"), color: "success" },
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Dashboard</h3>
      {loading && <div className="alert alert-secondary">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {cards.map((c) => (
          <div className="col-6 col-md-3 mb-3" key={c.label}>
            <div className={`card text-bg-${c.color} text-center`}>
              <div className="card-body">
                <h2>{c.value}</h2>
                <p className="mb-0">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}