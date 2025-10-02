import React from "react";
import { Award, Users, Zap, Target } from "lucide-react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <div className="min-vh-100">
      {/* Enhanced CSS Styles */}
      <style>
        {`
        /* Enhanced About AXG Hero Section */
        .about-hero-gradient {
          background: linear-gradient(135deg, #1d1d1b 0%, #2c2c2c 50%, #1d1d1b 100%) !important;
          position: relative !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-top: 76px !important;
        }
        .about-hero-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(64, 64, 64, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(64, 64, 64, 0.2) 0%, transparent 50%);
          pointer-events: none;
        }
        .about-hero-content {
          position: relative !important;
          z-index: 2 !important;
        }
        .about-hero-title {
          color: #ffffff !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
          margin-bottom: 1.5rem !important;
        }
        .about-hero-subtitle {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 1.25rem !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
          letter-spacing: -0.01em !important;
          max-width: 600px !important;
          margin: 0 auto !important;
        }
        .about-hero-section {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Professional Cards and Elements */
        .professional-card {
          background: #1d1d1b !important;
          border: 2px solid rgba(64, 64, 64, 0.2) !important;
          border-radius: 20px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          overflow: hidden !important;
          position: relative !important;
        }
        .professional-card:hover {
          border-color: rgba(64, 64, 64, 0.4) !important;
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
        }
        .professional-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(64, 64, 64, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .card-content {
          position: relative !important;
          z-index: 2 !important;
        }
        .professional-icon {
          width: 60px !important;
          height: 60px !important;
          background: linear-gradient(135deg, #404040 0%, #ffffff 100%) !important;
          color: #1d1d1b !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 auto 1.5rem auto !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 8px 24px rgba(64, 64, 64, 0.2) !important;
        }
        .professional-icon:hover {
          transform: scale(1.15) rotate(10deg) !important;
          box-shadow: 0 16px 40px rgba(64, 64, 64, 0.3) !important;
        }
        .professional-title {
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 1.3rem !important;
          margin-bottom: 1rem !important;
          letter-spacing: -0.01em !important;
        }
        .professional-text {
          color: rgba(255, 255, 255, 0.85) !important;
          font-size: 1rem !important;
          line-height: 1.6 !important;
          margin: 0 !important;
        }
        
        /* Enhanced Section Styling */
        .about-section-dark {
          background: #1d1d1b !important;
          position: relative !important;
        }
        .about-section-dark::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(64, 64, 64, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }
        .section-header-dark {
          color: #ffffff !important;
          font-weight: 700 !important;
          margin-bottom: 2rem !important;
          text-align: center !important;
          position: relative !important;
          z-index: 2 !important;
        }
        .section-subtitle-dark {
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 1.25rem !important;
          text-align: center !important;
          margin-bottom: 3rem !important;
          position: relative !important;
          z-index: 2 !important;
        }
        
        /* Enhanced Mission Section */
        .mission-section-dark {
          background: #1d1d1b !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .mission-section-dark::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(64, 64, 64, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }
        .mission-content {
          position: relative !important;
          z-index: 2 !important;
        }
        .mission-title {
          color: #ffffff !important;
          font-weight: 700 !important;
          margin-bottom: 2rem !important;
          letter-spacing: -0.02em !important;
        }
        .mission-text {
          color: rgba(255, 255, 255, 0.85) !important;
          font-size: 1.1rem !important;
          line-height: 1.8 !important;
          margin-bottom: 1.5rem !important;
        }
        
        /* Professional Action Buttons */
        .professional-action-btn {
          background: linear-gradient(135deg, #404040 0%, #1d1d1b 100%) !important;
          border: 2px solid #404040 !important;
          color: #ffffff !important;
          padding: 1rem 2rem !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          margin-top: 2rem !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .professional-action-btn:hover {
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%) !important;
          color: #1d1d1b !important;
          border-color: #ffffff !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 32px rgba(64, 64, 64, 0.3) !important;
        }
        .professional-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .professional-action-btn:hover::before {
          left: 100%;
        }
        
        /* Enhanced About Hero Section Layout */
        .about-hero-enhanced {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 3rem 0 !important;
          margin: 0 !important;
        }
        .hero-content-enhanced {
          text-align: center !important;
          max-width: 900px !important;
          margin: 0 auto !important;
          padding: 2rem !important;
        }
        .hero-description-enhanced {
          font-size: 1.2rem !important;
          line-height: 1.8 !important;
          color: rgba(255, 255, 255, 0.9) !important;
          margin: 2rem 0 !important;
          max-width: 700px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        `}
      </style>
      {/* Enhanced About AXG Hero Section */}
      <section className="about-hero-gradient about-hero-enhanced">
        <Container style={{ padding: "0" }}>
          <Row className="justify-content-center" style={{ margin: "0" }}>
            <Col lg={12}>
              <div className="about-hero-content hero-content-enhanced">
                <h1 className="display-2 about-hero-title">About AXG</h1>
                <p className="about-hero-subtitle">
                  Empowering creativity through premium photography accessories.
                </p>
                <p className="hero-description-enhanced">
                  We design and manufacture professional-grade camera batteries,
                  chargers, and accessories that photographers and videographers
                  trust worldwide. Founded by passionate creators, AXG has
                  become synonymous with reliability, innovation, and
                  exceptional performance in the photography industry.
                </p>
                <div className="mt-4">
                  <a href="#mission" className="professional-action-btn me-3">
                    <Target size={20} />
                    Our Mission
                  </a>
                  <a href="#values" className="professional-action-btn">
                    <Award size={20} />
                    Our Values
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Mission Section */}
      <section id="mission" className="py-5 mission-section-dark">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="mission-content">
                <h2 className="display-5 mission-title">Our Mission</h2>
                <p className="mission-text">
                  At AXG, we believe that creativity should never be limited by
                  equipment. Our mission is to provide photographers,
                  videographers, and creative professionals with premium
                  accessories that enhance their craft and unlock their full
                  potential.
                </p>
                <p className="mission-text">
                  Founded by passionate creators who understand the importance
                  of reliable, high-quality gear, AXG has become a trusted name
                  in the photography industry. We meticulously design and test
                  every product to ensure it meets the demanding standards of
                  professional use.
                </p>
                <p className="mission-text">
                  Whether you're capturing once-in-a-lifetime moments or
                  creating commercial masterpieces, AXG accessories provide the
                  power, reliability, and performance you need to bring your
                  vision to life.
                </p>
                <a href="/products" className="professional-action-btn">
                  <Zap size={20} />
                  Explore Products
                </a>
              </div>
            </Col>
            <Col lg={6}>
              <Card className="h-100 professional-card">
                <Card.Body className="p-5 card-content">
                  <h3 className="professional-title text-center mb-4">
                    Why Choose AXG?
                  </h3>
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex align-items-start">
                      <div
                        className="professional-icon me-3"
                        style={{
                          margin: "0 1rem 0 0",
                          width: "50px",
                          height: "50px",
                        }}
                      >
                        <Award size={24} />
                      </div>
                      <div className="flex-grow-1">
                        <h4
                          className="professional-title mb-2"
                          style={{ fontSize: "1.1rem" }}
                        >
                          Premium Quality
                        </h4>
                        <p className="professional-text">
                          Every product undergoes rigorous testing to ensure
                          professional-grade performance and reliability.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div
                        className="professional-icon me-3"
                        style={{
                          margin: "0 1rem 0 0",
                          width: "50px",
                          height: "50px",
                        }}
                      >
                        <Zap size={24} />
                      </div>
                      <div className="flex-grow-1">
                        <h4
                          className="professional-title mb-2"
                          style={{ fontSize: "1.1rem" }}
                        >
                          Innovation
                        </h4>
                        <p className="professional-text">
                          We constantly innovate to bring you the latest
                          technology in photography accessories and power
                          solutions.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div
                        className="professional-icon me-3"
                        style={{
                          margin: "0 1rem 0 0",
                          width: "50px",
                          height: "50px",
                        }}
                      >
                        <Users size={24} />
                      </div>
                      <div className="flex-grow-1">
                        <h4
                          className="professional-title mb-2"
                          style={{ fontSize: "1.1rem" }}
                        >
                          Community
                        </h4>
                        <p className="professional-text">
                          We're more than a brand – we're a community of
                          creators supporting each other's success.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Values Section */}
      <section id="values" className="py-5 about-section-dark">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 section-header-dark">Our Values</h2>
              <p className="section-subtitle-dark">
                The principles that guide everything we do
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={6} lg={3} className="text-center">
              <div className="professional-icon">
                <Award size={32} />
              </div>
              <h3 className="professional-title mb-3">Excellence</h3>
              <p className="professional-text">
                We strive for excellence in every product we create, ensuring
                the highest standards of quality and performance.
              </p>
            </Col>
            <Col md={6} lg={3} className="text-center">
              <div className="professional-icon">
                <Zap size={32} />
              </div>
              <h3 className="professional-title mb-3">Innovation</h3>
              <p className="professional-text">
                We embrace cutting-edge technology and creative solutions to
                push the boundaries of what's possible.
              </p>
            </Col>
            <Col md={6} lg={3} className="text-center">
              <div className="professional-icon">
                <Users size={32} />
              </div>
              <h3 className="professional-title mb-3">Community</h3>
              <p className="professional-text">
                We believe in fostering a supportive community where creators
                can share, learn, and grow together.
              </p>
            </Col>
            <Col md={6} lg={3} className="text-center">
              <div className="professional-icon">
                <Target size={32} />
              </div>
              <h3 className="professional-title mb-3">Purpose</h3>
              <p className="professional-text">
                Every product we make serves a purpose – to empower creators and
                enhance their artistic expression.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Story Section */}
      <section className="py-5 mission-section-dark">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <div className="mission-content">
                <h2 className="display-5 section-header-dark mb-5">
                  Our Story
                </h2>
                <div className="story-content">
                  <p className="mission-text">
                    AXG was born from a simple observation: creative
                    professionals deserve accessories that match their passion
                    and dedication. Our founders, experienced photographers
                    themselves, were frustrated with the compromises they had to
                    make with existing products.
                  </p>
                  <p className="mission-text">
                    In 2020, we set out to change that. Starting in a small
                    workshop, we began designing batteries, chargers, and
                    accessories that would meet the rigorous demands of
                    professional photography. Every prototype was tested in
                    real-world conditions by working photographers.
                  </p>
                  <p className="mission-text">
                    Today, AXG products are trusted by thousands of creators
                    worldwide. From wedding photographers who can't afford a
                    power failure to wildlife photographers working in extreme
                    conditions, our accessories provide the reliability and
                    performance that professionals demand.
                  </p>
                  <p className="mission-text">
                    But we're just getting started. As technology evolves and
                    creative needs change, AXG continues to innovate, ensuring
                    that every creator has the power to bring their vision to
                    life.
                  </p>
                  <a href="/contact" className="professional-action-btn">
                    <Users size={20} />
                    Get in Touch
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="py-5 text-white"
        style={{ backgroundColor: "#1d1d1b" }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-4">
                Ready to Power Your Creativity?
              </h2>
              <p className="fs-5 mb-4" style={{ color: "#d1d5db" }}>
                Join thousands of creators who trust AXG for their most
                important shoots
              </p>
              <a href="/products" className="professional-action-btn">
                <Zap size={20} />
                Shop Now
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
