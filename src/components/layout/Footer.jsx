import React from 'react';
import IconifyIcon from '../wrappers/IconifyIcon';
import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { currentYear } from '@/context/constants';
const Footer = () => {
  return <footer className="footer">
    <Container fluid>
      <Row className='d-flex justify-content-center align-items-center'>
        <Col xs={12} className="text-center d-flex justify-content-center align-items-center">
          {currentYear} © Nexus Built. Crafted by{' '}
          {/* Light theme logo */}
          <Image
            src="/Flashyminds-TM-White.png"
            height={25}
            width={100}
            className=" logo-light ms-1"
            alt="Flashyminds Logo Light"
          />
          {/* Dark theme logo */}
          <Image
            src="/Flashyminds-TM.png"
            height={25}
            width={100}
            className=" logo-dark ms-1"
            alt="Flashyminds Logo Dark"
          />
        </Col>
      </Row>
    </Container>
  </footer>;
};
export default Footer;