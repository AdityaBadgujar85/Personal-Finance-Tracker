import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import classes from './NavBar.module.css';

function NavBar() {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Navbar expand="lg" className={classes['NavBar-Color']} fixed="top">
                        <Container>
                            <Navbar.Brand>
                                <h1 className="m-0">Finance</h1>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbar-nav" />
                            <Navbar.Collapse id="navbar-nav">
                                <Nav className="ms-auto">
                                    <NavLink className={classes.linkDecoration} to={'/'}>DashBoard</NavLink>
                                    <NavLink className={classes.linkDecoration} to={'/transaction'}>Transactions</NavLink>
                                    <NavLink className={classes.linkDecoration} to={'/Budget'}>Budgets</NavLink>
                                    <NavLink className={classes.linkDecoration} to={'/profile'}>Profile</NavLink>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    );
}

export default NavBar;
