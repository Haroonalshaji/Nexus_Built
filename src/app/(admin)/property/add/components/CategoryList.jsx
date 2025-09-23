"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Form,
  Modal,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap"
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import { useRouter } from "next/navigation"
import {
  getListCategories,
  addNewCategory,
  updateCategoryName,
  deleteCategory,
} from "@/utils/apiCalls/commonApi"
import { useNotificationContext } from "@/context/useNotificationContext"

const PAGE_SIZE = 5 // categories per page

const ConstructionCategoriesAdmin = () => {
  const { push } = useRouter()
  const { showNotification } = useNotificationContext()

  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState({ categoryId: "" })

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await getListCategories()
      if (res?.data?.isSuccess) {
        const data = res.data.result.map((cat) => ({
          ...cat,
          subcategories: [],
          isExpanded: false,
        }))
        setCategories(data)
        setFilteredCategories(data)
      }
    } catch (err) {
      console.error(err)
      showNotification({
        message: "❌ Failed to fetch categories",
        variant: "danger",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Search categories
  useEffect(() => {
    const filtered = categories.filter((c) =>
      c.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
    setCurrentPage(1)
  }, [searchTerm, categories])

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE)
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Add category
  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) return
    try {
      const payload = { categoryName: categoryForm.name }
      const res = await addNewCategory(payload)
      if (res?.data?.isSuccess) {
        fetchCategories()
        setCategoryForm({ name: "", description: "" })
        setShowAddCategory(false)
        showNotification({
          message: `✅ ${res.data.message || "Category added successfully"}`,
          variant: "success",
        })
      } else {
        showNotification({
          message: `❌ ${res.data.message || "Failed to add category"}`,
          variant: "danger",
        })
      }
    } catch (err) {
      console.error(err)
      showNotification({
        message: "❌ Failed to add category",
        variant: "danger",
      })
    }
  }

  // Edit category
  const handleEditCategory = async () => {
    if (!selectedCategory || !categoryForm.name.trim()) return
    try {
      const payload = { id: selectedCategory.id, categoryName: categoryForm.name }
      const res = await updateCategoryName(payload)
      if (res?.data?.isSuccess) {
        fetchCategories()
        setSelectedCategory(null)
        setShowEditCategory(false)
        showNotification({
          message: `✅ ${res.data.message || "Category updated successfully"}`,
          variant: "success",
        })
      } else {
        showNotification({
          message: `❌ ${res.data.message || "Failed to update category"}`,
          variant: "danger",
        })
      }
    } catch (err) {
      console.error(err)
      showNotification({
        message: "❌ Failed to update category",
        variant: "danger",
      })
    }
  }

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await deleteCategory(categoryId)
      if (res?.data?.isSuccess) {
        fetchCategories()
        setShowDeleteConfirm(false)
        showNotification({
          message: `✅ ${res.data.message || "Category deleted successfully"}`,
          variant: "success",
        })
      } else {
        showNotification({
          message: `❌ ${res.data.message || "Failed to delete category"}`,
          variant: "danger",
        })
      }
    } catch (err) {
      console.error(err)
      showNotification({
        message: "❌ Failed to delete category",
        variant: "danger",
      })
    }
  }

  // Open modals
  const openEditCategoryDialog = (category) => {
    setSelectedCategory(category)
    setCategoryForm({ name: category.categoryName, description: "" })
    setShowEditCategory(true)
  }

  const openDeleteConfirm = (categoryId) => {
    setDeleteTarget({ categoryId })
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    handleDeleteCategory(deleteTarget.categoryId)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="container-fluid m-0">
      <Row className="mb-3">
        <Col lg={8}>
          <InputGroup>
            <Form.Control
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <CardHeader className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <div>
                <CardTitle as="h4">Service Categories</CardTitle>
                <p className="text-muted mb-0">Manage construction service categories</p>
              </div>
              <Button variant="primary" onClick={() => setShowAddCategory(true)}>
                <IconifyIcon icon="mdi:plus" className="me-2" />
                Add Category
              </Button>
            </CardHeader>
            <CardBody>
              {paginatedCategories.length === 0 && <p>No categories found.</p>}
              {paginatedCategories.map((category) => (
                <Card key={category.id} className="mb-3 border">
                  <CardBody className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{category.categoryName}</h5>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openEditCategoryDialog(category)}
                      >
                        <IconifyIcon icon="mdi:pencil" />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openDeleteConfirm(category.id)}
                      >
                        <IconifyIcon icon="mdi:delete" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </Button>
                  <span className="align-self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <CardHeader>
              <CardTitle as="h5">Overview</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-medium">Total Categories</span>
                <span className="badge bg-primary">{categories.length}</span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Add Category Modal */}
      <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g., HVAC, Painting"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCategory(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditCategory} onHide={() => setShowEditCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditCategory(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditCategory}>
            Update Category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <IconifyIcon icon="mdi:alert" className="me-2" />
            Are you sure you want to delete this category? This action cannot be undone.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ConstructionCategoriesAdmin
