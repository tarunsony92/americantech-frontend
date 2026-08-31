import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosInstance";
import { createResourceService } from "../../services/createResourceService";
import batchService from "../../services/batchService";
import ResourceManager from "../../components/admin/ResourceManager";

const userService = createResourceService("users");

const ManageUsers = () => {
  const navigate = useNavigate();

  // Roles are fetched so the form can show real role names instead of asking the admin to
  // remember magic numbers ("1 = admin, 2 = instructor, 3 = student").
  const [roleOptions, setRoleOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/roles")
      .then(({ data }) => {
        const roles = data.data?.items || [];
        setRoleOptions(roles.map((r) => ({ value: r.id, label: r.name })));
      })
      .catch(() => setRoleOptions([]));
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/courses")
      .then(({ data }) => {
        const courses = data.data?.items || [];
        setCourseOptions(courses.map((c) => ({ value: c.id, label: c.title })));
      })
      .catch(() => setCourseOptions([]));
  }, []);

  // Whenever the admin picks a course in the form, load that course's batches so the
  // batch dropdown only ever shows batches that actually belong to the chosen course.
  useEffect(() => {
    if (!selectedCourseId) {
      setBatchOptions([]);
      return;
    }
    batchService
      .list({ page: 1, limit: 999, courseId: selectedCourseId })
      .then(({ data }) => {
        const batches = data.data?.items || data.data || [];
        setBatchOptions(batches.map((b) => ({ value: b.id, label: b.name })));
      })
      .catch(() => setBatchOptions([]));
  }, [selectedCourseId]);

  // Map course id -> title, used to render the assigned course name in the table
  // without needing a lookup on every row render.
  const courseTitleById = courseOptions.reduce((acc, c) => {
    acc[c.value] = c.label;
    return acc;
  }, {});

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "course",
      label: "Assigned Course",
      render: (row) => (row.courseId ? courseTitleById[row.courseId] || `#${row.courseId}` : "-"),
    },
    {
      key: "batch",
      label: "Assigned Batch",
      render: (row) => row.batch?.name || (row.batchId ? `#${row.batchId}` : "-"),
    },
    { key: "isActive", label: "Active" },
    {
      key: "view",
      label: "",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/users/${row.id}`)}
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  const fields = [
    { key: "fullName", label: "Full Name", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "phone", label: "Phone" },
    { key: "password", label: "Password (only used when creating a new user)", type: "password" },
    { key: "roleId", label: "Role", type: "select", options: roleOptions, required: true },
    {
      key: "courseId",
      label: "Course",
      type: "select",
      options: courseOptions,
      onChange: (value) => setSelectedCourseId(value),
    },
    {
      key: "batchId",
      label: "Batch",
      type: "select",
      options: batchOptions,
    },
    { key: "isActive", label: "Active", type: "checkbox" },
  ];

  return (
    <>
      <Helmet><title>Manage Users | Admin</title></Helmet>
      <ResourceManager title="Users" service={userService} columns={columns} fields={fields} />
    </>
  );
};

export default ManageUsers;