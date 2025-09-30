"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { addNewAdminUser, getAdminUserById, updateAdminUser } from "@/utils/apiCalls/auth";
import { useNotificationContext } from "@/context/useNotificationContext";

const AdminUserPage = () => {
    const searchParams = useSearchParams();
    const adminGuid = searchParams.get("adminGuid");
    console.log(adminGuid); // works now // dynamic route
    const router = useRouter();
    console.log("Admin GUID from params:", adminGuid);

    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        emailId: "",
        contactNo: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { showNotification } = useNotificationContext();

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const fetchAdminUser = async () => {
        if (!adminGuid) return;
        try {
            const res = await getAdminUserById(adminGuid);
            setFormData(res.data.result || {});
        } catch (err) {
            console.error("❌ Error fetching admin user", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (adminGuid && isEditing) {
                // Update existing admin
                let payload = {
                    userGuid: adminGuid,
                    userName: formData.userName,
                    password: formData.password,
                    emailId: formData.emailId,
                    contactNo: formData.contactNo
                }
                const response = await updateAdminUser(payload);
                showNotification({ variant: "success", message: response.data.message || "User updated successfully" });
                setIsEditing(false);
                fetchAdminUser();
            } else {
                // Create new admin
                const response = await addNewAdminUser(formData);
                showNotification({ variant: "success", message: response.data.message || "User added successfully" });
                setFormData({
                    userName: "",
                    password: "",
                    emailId: "",
                    contactNo: "",
                })
                router.push("/adminUsers/view"); // go back to list
            }
        } catch (error) {
            showNotification({ variant: "danger", message: error.response?.data?.message || "Failed to save user" });
        } finally {
            setIsSubmitting(false);
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (adminGuid) fetchAdminUser();
        setFormData({
            userName: "",
            password: "",
            emailId: "",
            contactNo: "",
        })
    }, [adminGuid]);

    return (
        <div className="container">
            <PageTitle title={adminGuid ? "Admin User Details" : "Add Admin User"} subName="Admin Management" />

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>{adminGuid ? "View Admin User" : "Add Admin User"}</CardTitle>

                    <CardHeader>
                        <CardTitle>{adminGuid ? "View Admin User" : "Add Admin User"}</CardTitle>
                    </CardHeader>

                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>User Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.userName}
                                        onChange={(e) => handleChange("userName", e.target.value)}
                                        readOnly={adminGuid && !isEditing}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Password *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        readOnly={adminGuid && !isEditing}
                                        required={!adminGuid} // only required when creating
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.emailId}
                                        onChange={(e) => handleChange("emailId", e.target.value)}
                                        readOnly={adminGuid && !isEditing}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Contact No *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.contactNo}
                                        onChange={(e) => handleChange("contactNo", e.target.value)}
                                        readOnly={adminGuid && !isEditing}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex gap-2">
                            {!adminGuid ? (
                                <>
                                    <Button type="submit" variant="danger" disabled={isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </Button>
                                    <Button type="button" variant="outline-secondary" onClick={() => setFormData({
                                        userName: "",
                                        password: "",
                                        emailId: "",
                                        contactNo: "",
                                    })}>
                                        Clear
                                    </Button>
                                </>

                            ) : isEditing ? (
                                <>
                                    <Button type="submit" variant="success" disabled={isSubmitting}>
                                        {isSubmitting ? "Updating..." : "Save Changes"}
                                    </Button>
                                    <Button type="button" variant="outline-secondary" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <button as="button" type="button" variant="primary" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                            )}
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AdminUserPage;
