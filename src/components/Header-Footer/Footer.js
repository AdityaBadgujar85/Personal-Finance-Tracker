import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'react-bootstrap';
import classes from './Footer.module.css';

function Footer() {
    return (
        <footer className={classes.NavBarColor}>
            <Container>
                <Row className="text-center">
                    <Col>
                        <h5 className="text-white">
                            © {new Date().getFullYear()} Finance
                        </h5>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
