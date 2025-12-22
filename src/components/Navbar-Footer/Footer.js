    import React from 'react'
    import { Container,Col,Row, Nav } from 'react-bootstrap'
    import classes from './Footer.module.css'
    import { FaFacebook,FaInstagram,FaLinkedin,FaTwitter} from 'react-icons/fa'
    import { NavLink } from 'react-router-dom'
    function Footer(){
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear(); 
        return(
            <Container fluid className={classes.mainContainer}>
                <Row>
                    <Col>
                        <footer>
                            <Container fluid className={classes.container}>
                            <Row>
                            <Col md={4}>
                                <h1 className={classes.brandh1}>Finance</h1>
                            </Col>
                            <Col md={4} className={classes.navLinksContainer}>
                                <NavLink to={'/'} className={classes.navLinkDesign}>Home</NavLink>
                                <NavLink to={'/transaction'} className={classes.navLinkDesign}>Trasaction</NavLink>
                                <NavLink to={'/budget'} className={classes.navLinkDesign}>Budget</NavLink>
                                <NavLink to={'/profile'} className={classes.navLinkDesign}>Profile</NavLink>
                            </Col>
                            <Col md={4} className={classes.iconContainer}>
                               <a href="https://www.facebook.com"><FaFacebook size={23}/></a>
                               <a href="https://www.instagram.com"><FaInstagram size={23}/></a> 
                               <a href="https://www.linkedin.com"><FaLinkedin size={23}/></a> 
                               <a href="https://www.x.com"><FaTwitter size={23}/></a> 
                            </Col>  
                            </Row>
                            <hr style={{color:'white'}}/>
                            <Row className={classes.rightsContainer}>
                                <Col>
                                    <p>©{currentYear} Finance. All Rights Reserved</p>
                                </Col>
                            </Row>
                            </Container>
                        </footer>
                    </Col>
                </Row>
            </Container>
        )
    }
    export default Footer