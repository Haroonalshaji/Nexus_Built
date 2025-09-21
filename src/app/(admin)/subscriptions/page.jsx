'use client';

import { useState, useEffect } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row, Spinner, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageTitle from '@/components/PageTitle';
import TextFormInput from '@/components/from/TextFormInput';
import SelectFormInput from '@/components/from/SelectFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';

// Currency options for the select dropdown
const currencyOptions = [
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'QAR', label: 'QAR - Qatari Riyal' },
  { value: 'KWD', label: 'KWD - Kuwaiti Dinar' },
  { value: 'BHD', label: 'BHD - Bahraini Dinar' },
  { value: 'OMR', label: 'OMR - Omani Rial' },
  { value: 'JOD', label: 'JOD - Jordanian Dinar' }
];

export default function Subscriptions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ show: false, type: 'success', message: '' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      subscriptionGuid: '',
      subscriptionName: '',
      description: '',
      monthlyPrice: 0,
      quarterlyPrice: 0,
      annualPrice: 0,
      currencyType: 'AED'
    }
  });

  // Simulate GET request - replace with actual API call
  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/subscriptions');
      // const data = await response.json();
      
      // Mock data for now
      const mockData = {
        subscriptionGuid: 'sub-123456789',
        subscriptionName: 'Premium Plan',
        description: 'Access to all premium features with priority support',
        monthlyPrice: 99.99,
        quarterlyPrice: 279.99,
        annualPrice: 999.99,
        currencyType: 'AED'
      };
      
      setSubscriptionData(mockData);
      reset(mockData);
      setAlertMessage({ show: true, type: 'success', message: 'Subscription data loaded successfully!' });
    } catch (error) {
      setAlertMessage({ show: true, type: 'danger', message: 'Failed to load subscription data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate PUT request - replace with actual API call
  const updateSubscriptionData = async (data) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/subscriptions', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Mock success response
      console.log('Updating subscription data:', data);
      
      setSubscriptionData(data);
      setIsEditing(false);
      setAlertMessage({ show: true, type: 'success', message: 'Subscription updated successfully!' });
    } catch (error) {
      setAlertMessage({ show: true, type: 'danger', message: 'Failed to update subscription data' });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    updateSubscriptionData(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(subscriptionData);
  };

  const handleRefresh = () => {
    fetchSubscriptionData();
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  return (
    <>
      <PageTitle title="Subscriptions" subName="Management" />
      <Row>
        <Col xl={12}>
          <ComponentContainerCard 
            title="Subscription Details" 
            description="Manage subscription plans and pricing information"
            className="mb-4"
          >
            {alertMessage.show && (
              <Alert 
                variant={alertMessage.type} 
                dismissible 
                onClose={() => setAlertMessage({ show: false, type: 'success', message: '' })}
                className="mb-4"
              >
                {alertMessage.message}
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading subscription data...</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit(onSubmit)} className="row g-3 mt-3">
                <Row>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="subscriptionGuid"
                      label="Subscription GUID"
                      placeholder="Enter subscription GUID"
                      disabled={!isEditing}
                      containerClassName="mb-3"
                      rules={{ required: 'Subscription GUID is required' }}
                    />
                  </Col>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="subscriptionName"
                      label="Subscription Name"
                      placeholder="Enter subscription name"
                      disabled={!isEditing}
                      containerClassName="mb-3"
                      rules={{ required: 'Subscription name is required' }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <TextAreaFormInput
                      control={control}
                      name="description"
                      label="Description"
                      placeholder="Enter subscription description"
                      disabled={!isEditing}
                      containerClassName="mb-3"
                      rows={3}
                      rules={{ required: 'Description is required' }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="monthlyPrice"
                      label="Monthly Price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      disabled={!isEditing}
                      containerClassName="mb-3"
                      rules={{ 
                        required: 'Monthly price is required',
                        min: { value: 0, message: 'Price must be greater than or equal to 0' }
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="quarterlyPrice"
                      label="Quarterly Price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      disabled={!isEditing}
                      containerClassName="mb-3"
                      rules={{ 
                        required: 'Quarterly price is required',
                        min: { value: 0, message: 'Price must be greater than or equal to 0' }
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="annualPrice"
                      label="Annual Price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      disabled={!isEditing}
                      containerClassName="mb-3"
                      rules={{ 
                        required: 'Annual price is required',
                        min: { value: 0, message: 'Price must be greater than or equal to 0' }
                      }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <SelectFormInput
                      control={control}
                      name="currencyType"
                      label="Currency Type"
                      // options={currencyOptions}
                      options={[{ label: "AED", value: "AED" }]}
                      disabled={true} // always disabled
                      // disabled={!isEditing}
                      containerClassName="mb-3"
                      defaultValue="AED"
                      placeholder="AED"
                      // rules={{ required: 'Currency type is required' }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <div className="d-flex gap-2 flex-wrap">
                      {!isEditing ? (
                        <>
                          <Button 
                            variant="primary" 
                            onClick={handleEdit}
                            disabled={isLoading}
                          >
                            Edit Subscription
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            onClick={handleRefresh}
                            disabled={isLoading}
                          >
                            Refresh Data
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="success" 
                            type="submit"
                            disabled={isLoading || !isDirty}
                          >
                            {isLoading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            onClick={handleCancel}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  );
}