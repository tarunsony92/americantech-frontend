import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosInstance";
import { createResourceService } from "../../services/createResourceService";
import ResourceManager from "../../components/admin/ResourceManager";

const userService = createResourceService("users");

const ManageUsers = () => {
  // Roles are fetched so the form can show real role names instead of asking the admin to
  // remember magic numbers ("1 = admin, 2 = instructor, 3 = student").
  const [roleOptions, setRoleOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);

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

  // Map course id -> title, used to render assigned course names in the table
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
      key: "courses",
      label: "Assigned Courses",
      render: (row) => {
        const ids = row.courseIds || row.courses?.map((c) => c.id) || [];
        if (ids.length === 0) return "-";
        const names = ids.map((id) => courseTitleById[id] || `#${id}`);
        return names.join(", ");
      },
    },
    { key: "isActive", label: "Active" },
  ];

  const fields = [
    { key: "fullName", label: "Full Name", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "phone", label: "Phone" },
    { key: "password", label: "Password (only used when creating a new user)", type: "password" },
    { key: "roleId", label: "Role", type: "select", options: roleOptions, required: true },
    {
      key: "courseIds",
      label: "Courses",
      type: "checkbox-group",
      options: courseOptions,
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