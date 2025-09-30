"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Badge, Image } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { getEachEnquiries, getVendorEnqAttachments, getVendorQuoteAdmin } from "@/utils/apiCalls/commonApi";

const IndividualEnquiryPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const enquiryGuid = searchParams.get("enquiryGuid");

    const [enquiry, setEnquiry] = useState({});
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showRedirect, setShowRedirect] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const sortedQuotes = quotes.sort((a, b) => new Date(b.updatedOn) - new Date(a.updatedOn));

    const priorityConfig = {
        High: "bg-danger text-white",
        Medium: "bg-warning text-dark",
        Low: "bg-success text-white"
    };

    const fetchEnquiry = async () => {
        if (!enquiryGuid) return;
        setIsLoading(true);
        try {
            const res = await getEachEnquiries(enquiryGuid);
            if (res.data.isSuccess && res.data.result) {
                setEnquiry(res.data.result);

                if (res.data.result.attachmentCount > 0) {
                    const attRes = await getVendorEnqAttachments(enquiryGuid);
                    setAttachments(attRes.data.result || []);
                }
            } else {
                setShowRedirect(true); // no data
            }
        } catch (err) {
            console.error("Error fetching enquiry:", err);
            setShowRedirect(true);
        } finally {
            setIsLoading(false);
        }
    };

    const vendorQuotes = async () => {
        if (!enquiryGuid) return;
        setIsLoading(true);
        try {
            const res = await getVendorQuoteAdmin(enquiryGuid);
            if (res.data.isSuccess && res.data.result) {
                setQuotes(res.data.result || []);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }

    useEffect(() => {
        fetchEnquiry();
        vendorQuotes();
        // // Redirect after 5 seconds if still loading or no data
        // const timer = setTimeout(() => {
        //     if (!enquiryGuid || !enquiry?.enquiryGuid) {
        //         router.push("/reviews");
        //     }
        // }, 5000);

        // return () => clearTimeout(timer);
    }, [enquiryGuid]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-gray-500 text-lg mb-3">Loading enquiry...</p>
                <Button onClick={() => router.push("/reviews")}>Go to Enquiries</Button>
            </div>
        );
    }

    if (showRedirect) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-red-500 text-lg mb-3">Enquiry not found or cannot be loaded.</p>
                <Button onClick={() => router.push("/reviews")}>Go to Enquiries</Button>
            </div>
        );
    }

    return (
        <div className="container">
            <PageTitle title="Enquiry Details" subName="Real Estate" />

            <Row>
                <Col lg={8}>
                    <Card className="mb-3 shadow-sm">
                        <div className={`h-1 ${enquiry.priorityLevel === "High" ? "bg-danger" : enquiry.priorityLevel === "Medium" ? "bg-warning" : "bg-success"}`}></div>
                        <CardHeader className="d-flex justify-content-between align-items-start">
                            <div>
                                <CardTitle>{enquiry.serviceRequired}</CardTitle>
                                <Badge className={priorityConfig[enquiry.priorityLevel]}>{enquiry.priorityLevel}</Badge>
                                <Badge bg="info" className="ms-2">{enquiry.status}</Badge>
                            </div>
                            <div className="text-end">
                                <div className="mb-1">Posted: {new Date(enquiry.addedOn).toLocaleDateString()}</div>
                                <div className="fw-bold text-danger">AED {enquiry.totalAmount}</div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="mb-3 shadow-sm">
                        <CardHeader>
                            <CardTitle>Project Description</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p>{enquiry.description}</p>
                        </CardBody>
                    </Card>

                    {enquiry.attachmentCount > 0 && (
                        <Card className="mb-3 shadow-sm">
                            <CardHeader>
                                <CardTitle>Attachments ({enquiry.attachmentCount})</CardTitle>
                            </CardHeader>
                            <CardBody className="d-flex gap-2 flex-wrap">
                                {attachments.map((att, idx) => (
                                    <div key={idx} className="position-relative" style={{ width: "150px", height: "100px", cursor: "pointer" }}>
                                        <Image
                                            src={att.filePath}
                                            alt={att.fileName}
                                            height={100}
                                            width={150}
                                            onClick={() => window.open(att.filePath, "_blank")}
                                            className="rounded"
                                        />
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    )}

                    <div className="card shadow-sm rounded" style={{borderRadius:"10px"}}>
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Vendor Quotes</h5>
                        </div>

                        <div className="list-group list-group-flush">
                            {sortedQuotes.map((quote,idx) => {
                                const isUpdated =
                                    new Date(quote.addedOn).getTime() !==
                                    new Date(quote.updatedOn).getTime();

                                return (
                                    <div
                                        key={quote.quoteGuid}
                                        className="list-group-item mb-1 d-flex flex-column flex-md-row justify-content-between align-items-start"
                                    >
                                        {/* Left Section: Vendor + Details */}
                                        <div className="flex-grow-1 pe-3">
                                            <div className="d-flex gap-1"><small>{idx+1}. </small><h5 className="fw-bold mb-1">{quote.businessName}</h5></div>
                                            <small className="text-muted d-block mb-2">
                                                {quote.firstName} {quote.lastName} | {quote.emailAddress} |{" "}
                                                {quote.phoneNo}
                                            </small>

                                            <div className="small text-muted mb-1">
                                                <strong>Description:</strong> {quote.description}
                                            </div>
                                            <div className="small text-muted mb-1">
                                                <strong>Materials:</strong> {quote.matAndEqup}
                                            </div>
                                            <div className="small text-muted mb-1">
                                                <strong>Warranty:</strong> {quote.warrantyInfo}
                                            </div>
                                            {quote.notes && (
                                                <div className="small text-muted mb-1">
                                                    <strong>Notes:</strong> {quote.notes}
                                                </div>
                                            )}

                                            {quote.attachment && (
                                                <div className="mt-2">
                                                    <strong>Attachment:</strong>{" "}
                                                    <a
                                                        href={quote.attachment}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="text-primary"
                                                    >
                                                        {quote.attachmentType === "Image" ? "View Image" : "Download"}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Section: Price + Status */}
                                        <div className="text-md-end mt-3 mt-md-0">
                                            <h5 className="fw-bold text-danger">
                                                AED {quote.quotePrice.toLocaleString()}
                                            </h5>
                                            <div className="text-muted small mb-2">
                                                Timeline: {quote.timeLine}
                                            </div>

                                            {isUpdated ? (
                                                <span className="badge bg-warning text-dark">
                                                    Updated: {new Date(quote.updatedOn).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    Submitted: {new Date(quote.addedOn).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </Col>

                <Col lg={4} className="space-y-3 ">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p><strong>Name:</strong> {enquiry.customerName}</p>
                            <p><strong>Email:</strong> {enquiry.emailAddress}</p>
                            <p><strong>Phone:</strong> {enquiry.phoneNumber}</p>
                            <p><strong>Service:</strong> {enquiry.serviceRequired}</p>
                            <p><strong>Added On:</strong> {new Date(enquiry.addedOn).toLocaleString()}</p>
                            <p><strong>Status:</strong> {enquiry.status}</p>
                        </CardBody>
                    </Card>

                    <Card className="shadow-sm bg-light">
                        <CardHeader>
                            <CardTitle>Total Vendors Interested</CardTitle>
                        </CardHeader>
                        <CardBody className="text-center">
                            <div className="text-3xl fw-bold">{enquiry.totalQuotes}</div>
                            <p>Vendors interested</p>
                        </CardBody>
                    </Card>

                    <Button className="w-100" onClick={() => router.push("/reviews")}>
                        Go to Enquiries
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default IndividualEnquiryPage;
