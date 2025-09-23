"use client"

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Form, Modal, Alert } from "react-bootstrap"
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import useQueryParams from "@/hooks/useQueryParams";
import { useRouter } from "next/navigation";

const ConstructionCategoriesAdmin = () => {
  const queryParams = useQueryParams();
  const { push } = useRouter();

  const initialCategories = [
    {
      id: "1",
      name: "Flooring",
      description: "All types of flooring services and materials",
      subcategories: [
        { id: "1-1", name: "Hardwood Flooring", description: "Installation and repair of hardwood floors" },
        { id: "1-2", name: "Tile Installation", description: "Ceramic, porcelain, and natural stone tiles" },
        { id: "1-3", name: "Carpet Installation", description: "Residential and commercial carpet services" },
        { id: "1-4", name: "Laminate Flooring", description: "Laminate floor installation and maintenance" },
        { id: "1-5", name: "Vinyl Flooring", description: "LVT, LVP, and sheet vinyl installation" },
      ],
      isExpanded: false,
    },
    {
      id: "2",
      name: "Roofing",
      description: "Roofing installation, repair, and maintenance services",
      subcategories: [
        { id: "2-1", name: "Asphalt Shingles", description: "Asphalt shingle installation and repair" },
        { id: "2-2", name: "Metal Roofing", description: "Steel, aluminum, and copper roofing" },
        { id: "2-3", name: "Tile Roofing", description: "Clay and concrete tile roofing" },
        { id: "2-4", name: "Flat Roofing", description: "Commercial flat roof systems" },
        { id: "2-5", name: "Roof Repair", description: "Emergency and maintenance roof repairs" },
      ],
      isExpanded: false,
    },
    {
      id: "3",
      name: "Plumbing",
      description: "Plumbing installation and repair services",
      subcategories: [
        { id: "3-1", name: "Pipe Installation", description: "New pipe installation and replacement" },
        { id: "3-2", name: "Fixture Installation", description: "Sinks, toilets, and faucet installation" },
        { id: "3-3", name: "Water Heater Services", description: "Water heater installation and repair" },
        { id: "3-4", name: "Drain Cleaning", description: "Drain and sewer line cleaning" },
      ],
      isExpanded: false,
    },
    {
      id: "4",
      name: "Electrical",
      description: "Electrical installation and repair services",
      subcategories: [
        { id: "4-1", name: "Wiring Installation", description: "New electrical wiring and rewiring" },
        { id: "4-2", name: "Panel Upgrades", description: "Electrical panel installation and upgrades" },
        { id: "4-3", name: "Lighting Installation", description: "Interior and exterior lighting" },
        { id: "4-4", name: "Outlet Installation", description: "Standard and specialty outlet installation" },
      ],
      isExpanded: false,
    },
  ]

  const [categories, setCategories] = useState(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" })
  const [subcategoryForm, setSubcategoryForm] = useState({ name: "", description: "", categoryId: "" })

  // Modal states
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [showAddSubcategory, setShowAddSubcategory] = useState(false)
  const [showEditSubcategory, setShowEditSubcategory] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState({ type: "", categoryId: "", subcategoryId: "" })

  const handleAddCategory = () => {
    if (categoryForm.name.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: categoryForm.name,
        description: categoryForm.description,
        subcategories: [],
        isExpanded: false,
      }
      setCategories([...categories, newCategory])
      setCategoryForm({ name: "", description: "" })
      setShowAddCategory(false)
    }
  }

  const handleEditCategory = () => {
    if (selectedCategory && categoryForm.name.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, name: categoryForm.name, description: categoryForm.description }
            : cat,
        ),
      )
      setCategoryForm({ name: "", description: "" })
      setSelectedCategory(null)
      setShowEditCategory(false)
    }
  }

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId))
    setShowDeleteConfirm(false)
  }

  const handleAddSubcategory = () => {
    if (subcategoryForm.name.trim() && subcategoryForm.categoryId) {
      const newSubcategory = {
        id: Date.now().toString(),
        name: subcategoryForm.name,
        description: subcategoryForm.description,
      }
      setCategories(
        categories.map((cat) =>
          cat.id === subcategoryForm.categoryId
            ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
            : cat,
        ),
      )
      setSubcategoryForm({ name: "", description: "", categoryId: "" })
      setShowAddSubcategory(false)
    }
  }

  const handleEditSubcategory = () => {
    if (selectedSubcategory && subcategoryForm.name.trim() && subcategoryForm.categoryId) {
      setCategories(
        categories.map((cat) =>
          cat.id === subcategoryForm.categoryId
            ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === selectedSubcategory.id
                  ? { ...sub, name: subcategoryForm.name, description: subcategoryForm.description }
                  : sub,
              ),
            }
            : cat,
        ),
      )
      setSubcategoryForm({ name: "", description: "", categoryId: "" })
      setSelectedSubcategory(null)
      setShowEditSubcategory(false)
    }
  }

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId) }
          : cat,
      ),
    )
    setShowDeleteConfirm(false)
  }

  const toggleCategoryExpansion = (categoryId) => {
    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat)))
  }

  const openEditCategoryDialog = (category) => {
    setSelectedCategory(category)
    setCategoryForm({ name: category.name, description: category.description })
    setShowEditCategory(true)
  }

  const openEditSubcategoryDialog = (category, subcategory) => {
    setSelectedSubcategory(subcategory)
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description,
      categoryId: category.id,
    })
    setShowEditSubcategory(true)
  }

  const openAddSubcategoryDialog = (categoryId) => {
    setSubcategoryForm({ name: "", description: "", categoryId })
    setShowAddSubcategory(true)
  }

  const openDeleteConfirm = (type, categoryId, subcategoryId = "") => {
    setDeleteTarget({ type, categoryId, subcategoryId })
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTarget.type === "category") {
      handleDeleteCategory(deleteTarget.categoryId)
    } else if (deleteTarget.type === "subcategory") {
      handleDeleteSubcategory(deleteTarget.categoryId, deleteTarget.subcategoryId)
    }
  }


  useEffect(() => {
  }, []);

  const totalSubcategories = categories.reduce((total, cat) => total + cat.subcategories.length, 0)
  const maxSubcategories = Math.max(...categories.map((cat) => cat.subcategories.length), 0)

  return (
    <div className="container-fluid m-0">
      {/* Header */}
      <div className="d-none align-items-center mb-4">
        <IconifyIcon icon="mdi:construction" className="fs-1 text-primary me-3" />
        <div className="d-none">
          <h1 className="mb-1">Construction Service Categories</h1>
          <p className="text-muted mb-0">Manage categories and subcategories for vendor quotation system</p>
        </div>
      </div>

      <Row>
        {/* Main Categories Panel */}
        <Col lg={8}>
          <Card>
            <CardHeader className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <div>
                <CardTitle as="h4">Service Categories</CardTitle>
                <p className="text-muted mb-0">Manage construction service categories and their subcategories</p>
              </div>
              <Button variant="primary" onClick={() => setShowAddCategory(true)}>
                <IconifyIcon icon="mdi:plus" className="me-2" />
                Add Category
              </Button>
            </CardHeader>
            <CardBody>
              {categories.map((category) => (
                <Card key={category.id} className="mb-3 border">
                  <CardBody>
                    <div className="d-flex flex-wrap gap-2 justify-content-md-between justify-content-center align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        {/* <Button
                          variant="link"
                          size="sm"
                          className="p-0 me-2"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          <IconifyIcon
                            icon={category.isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"}
                            className="fs-5"
                          />
                        </Button> */}
                        <div>
                          <h5 className="mb-1">{category.name}</h5>
                          <p className="text-muted mb-0 small">{category.description}</p>
                        </div>
                        <span className="badge bg-secondary ms-3">{category.subcategories.length} subcategories</span>
                      </div>
                      <div className="d-flex gap-2">
                        {/* <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openAddSubcategoryDialog(category.id)}
                        >
                          <IconifyIcon icon="mdi:plus" />
                        </Button> */}
                        <Button variant="outline-secondary" size="sm" onClick={() => openEditCategoryDialog(category)}>
                          <IconifyIcon icon="mdi:pencil" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openDeleteConfirm("category", category.id)}
                        >
                          <IconifyIcon icon="mdi:delete" />
                        </Button>
                      </div>
                    </div>

                    {/* {category.isExpanded && (
                      <div className="ms-4 mt-3">
                        {category.subcategories.length > 0 ? (
                          category.subcategories.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className="d-flex flex-wrap gap-2 justify-content-md-between justify-content-center align-items-center p-3 bg-light rounded mb-2"
                            >
                              <div>
                                <h6 className="mb-1">{subcategory.name}</h6>
                                <p className="text-muted mb-0 small">{subcategory.description}</p>
                              </div>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => openEditSubcategoryDialog(category, subcategory)}
                                >
                                  <IconifyIcon icon="mdi:pencil" />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => openDeleteConfirm("subcategory", category.id, subcategory.id)}
                                >
                                  <IconifyIcon icon="mdi:delete" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted fst-italic">No subcategories yet</p>
                        )}
                      </div>
                    )} */}
                  </CardBody>
                </Card>
              ))}
            </CardBody>
          </Card>
        </Col>

        {/* Statistics Panel */}
        <Col lg={4}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle as="h5">Overview</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-medium">Total Categories</span>
                <span className="badge bg-primary">{categories.length}</span>
              </div>
              <div className="d-none justify-content-between align-items-center mb-3">
                <span className="fw-medium">Total Subcategories</span>
                <span className="badge bg-primary">{totalSubcategories}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-medium">Most Subcategories</span>
                <span className="badge bg-primary">{maxSubcategories}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h5">Category Breakdown</CardTitle>
            </CardHeader>
            <CardBody>
              {categories.map((category) => (
                <div key={category.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-truncate">{category.name}</span>
                  <span className="badge bg-secondary ms-2">{category.subcategories.length}</span>
                </div>
              ))}
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
                placeholder="e.g., HVAC, Painting, Landscaping"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Brief description of the service category"
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
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
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

      {/* Add Subcategory Modal */}
      <Modal show={showAddSubcategory} onHide={() => setShowAddSubcategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory Name</Form.Label>
              <Form.Control
                type="text"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                placeholder="e.g., Hardwood Installation, Tile Repair"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                placeholder="Brief description of the subcategory"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddSubcategory(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSubcategory}>
            Add Subcategory
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Subcategory Modal */}
      <Modal show={showEditSubcategory} onHide={() => setShowEditSubcategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory Name</Form.Label>
              <Form.Control
                type="text"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditSubcategory(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubcategory}>
            Update Subcategory
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
            Are you sure you want to delete this {deleteTarget.type}?
            {deleteTarget.type === "category" && " This will also delete all subcategories."}
            This action cannot be undone.
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
