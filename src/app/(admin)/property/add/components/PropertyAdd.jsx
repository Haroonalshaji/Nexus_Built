'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import TextFormInput from '@/components/from/TextFormInput';

const schema = yup.object({
  categoryName: yup.string().required('Category name is required'),
  subcategories: yup.array().of(
    yup.object({
      name: yup.string().required('Subcategory is required')
    })
  ).min(1, 'At least one subcategory is required')
});

const CategoryAdd = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryName: '',
      subcategories: [{ name: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subcategories'
  });

  const onSubmit = (data) => {
    console.log('Form Submitted:', data);
    // You can send this data to your backend API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle as="h4">Add Category & Subcategories</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <TextFormInput control={control} name="categoryName" label="Category Name" placeholder="e.g. Flooring, Roofing" />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg={12}>
              <h5>Subcategories</h5>
              {fields.map((item, index) => (
                <Row key={item.id} className="align-items-center mb-2">
                  <Col md={10}>
                    <TextFormInput control={control} name={`subcategories.${index}.name`} placeholder="e.g. Tiles, Marble" label={`Subcategory ${index + 1}`} />
                  </Col>
                  <Col md={2} className="d-flex align-items-center mt-3">
                    <Button variant="danger" type="button" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" type="button" onClick={() => append({ name: '' })}>
                Add Subcategory
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row className="justify-content-end mt-3">
        <Col lg={2}>
          <Button variant="primary" type="submit" className="w-100">Save</Button>
        </Col>
        <Col lg={2}>
          <Button variant="outline-secondary" type="button" className="w-100">Cancel</Button>
        </Col>
      </Row>
    </form>
  );
};

export default CategoryAdd;
