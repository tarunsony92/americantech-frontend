import { Helmet } from "react-helmet-async";
import { createResourceService } from "../../services/createResourceService";
import ResourceManager from "../../components/admin/ResourceManager";

const studentService = createResourceService("students");

const COLUMNS = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "enrolledCourses", label: "Enrolled Courses" },
];

const ManageStudents = () => (
  <>
    <Helmet><title>Manage Students | Admin</title></Helmet>
    <ResourceManager title="Students" service={studentService} columns={COLUMNS} />
  </>
);

export default ManageStudents;
