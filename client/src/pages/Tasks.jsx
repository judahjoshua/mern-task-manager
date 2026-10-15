import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "Pending",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) return setError("Title is required");

    try {
      if (editId) {
        await api.put(`/api/tasks/${editId}`, form);
        setSuccess("Task updated");
      } else {
        await api.post("/api/tasks", form);
        setSuccess("Task created");
      }
      setForm(emptyForm);
      setEditId(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task.priority,
      status: task.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setSuccess("Task deleted");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const priorityColor = { Low: "secondary", Medium: "warning", High: "danger" };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">{editId ? "Edit Task" : "Add Task"}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
            name="description"
            placeholder="Description"
            rows="2"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <button className="btn btn-primary me-2">
            {editId ? "Update" : "Add Task"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h4 className="mb-3">Your Tasks</h4>
      {loading && <div className="alert alert-secondary">Loading...</div>}
      {!loading && tasks.length === 0 && (
        <div className="alert alert-info">No tasks yet. Add your first one!</div>
      )}

      <div className="row">
        {tasks.map((t) => (
          <div className="col-12 col-md-6 col-lg-4 mb-3" key={t._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{t.title}</h5>
                <p className="card-text">{t.description}</p>
                <p className="mb-1">
                  <span className={`badge text-bg-${priorityColor[t.priority]}`}>
                    {t.priority}
                  </span>
                </p>
                <p className="small text-muted">
                  Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"}
                </p>
                <select
                  className="form-select form-select-sm mb-2"
                  value={t.status}
                  onChange={(e) => handleStatusChange(t._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
