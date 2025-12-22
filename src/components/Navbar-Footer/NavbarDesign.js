import React from 'react';
import { Navbar,Nav, Container, Col, Row } from 'react-bootstrap';
import classes from './Navbar.module.css'
import { NavLink } from 'react-router-dom';
function NavbarDesign(){
    return(
        <Container fluid>
          <Row>
            <Col md={12} className='p-0'>
                <Navbar sticky='top' expand='md' className={classes.NavContainer}>
                    <Container fluid>
                    <Navbar.Brand className={classes.BrandDesign}>
                        <h1>Finance</h1>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="nav-design" />
                    <Navbar.Collapse id="nav-design">
                    <Nav className={classes.navLinksContainer}>
                        <NavLink to="/" className={classes.navLinkDesign}>Home</NavLink>
                        <NavLink to="/transaction" className={classes.navLinkDesign}>Transaction</NavLink>
                        <NavLink to="/budget" className={classes.navLinkDesign}>Budget</NavLink>
                        <NavLink to="/profile" className={classes.navLinkDesign}>Profile</NavLink>
                    </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Col>
          </Row>
        </Container>
    );
}
export default NavbarDesign;