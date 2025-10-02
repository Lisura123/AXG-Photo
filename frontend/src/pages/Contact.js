import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy on all products. Items must be in original condition with all packaging and accessories included. Simply contact our customer service team to initiate a return.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide. Shipping costs and delivery times vary by location. Free shipping is available for orders over $75 within the US. International shipping typically takes 7-14 business days.",
    },
    {
      question: "What warranty do you provide?",
      answer:
        "All AXG products come with a comprehensive 2-year warranty covering manufacturing defects and normal wear and tear. Extended warranty options are also available for purchase.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also log into your account to view order status and tracking information in real-time.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through encrypted channels.",
    },
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#ffffff" }}>
      {/* Enhanced CSS Styles */}
      <style>
        {`
        .contact-form-card {
          border: 1px solid rgba(64, 64, 64, 0.1) !important;
          border-radius: 16px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: #ffffff !important;
        }
        .contact-form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(64, 64, 64, 0.12) !important;
          border-color: rgba(64, 64, 64, 0.2) !important;
        }
        .contact-input {
          border: 2px solid rgba(64, 64, 64, 0.1) !important;
          border-radius: 12px !important;
          padding: 14px 16px !important;
          font-size: 1rem !important;
          color: #1d1d1b !important;
          background: #ffffff !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .contact-input:focus {
          border-color: #404040 !important;
          box-shadow: 0 0 0 0.2rem rgba(64, 64, 64, 0.15) !important;
          transform: translateY(-2px);
        }
        .contact-input:hover {
          border-color: rgba(64, 64, 64, 0.3) !important;
        }
        .contact-input::placeholder {
          color: rgba(64, 64, 64, 0.6) !important;
        }
        .contact-label {
          color: #1d1d1b !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          margin-bottom: 8px !important;
          letter-spacing: -0.01em;
        }
        .contact-submit-btn {
          background: linear-gradient(135deg, #404040 0%, #1d1d1b 100%) !important;
          border: none !important;
          border-radius: 14px !important;
          padding: 16px 32px !important;
          font-weight: 700 !important;
          font-size: 1.1rem !important;
          letter-spacing: -0.01em !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .contact-submit-btn:hover {
          background: linear-gradient(135deg, #1d1d1b 0%, #000000 100%) !important;
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 12px 32px rgba(29, 29, 27, 0.3) !important;
        }
        .contact-submit-btn:active {
          transform: translateY(-1px) scale(0.98) !important;
        }
        .contact-submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .contact-submit-btn:hover::before {
          left: 100%;
        }
        .form-section-header {
          color: #1d1d1b !important;
          font-weight: 700 !important;
          font-size: 1.5rem !important;
          margin-bottom: 1.5rem !important;
          letter-spacing: -0.02em !important;
          position: relative !important;
        }
        .form-section-header::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #404040, #1d1d1b);
          border-radius: 2px;
        }
        .form-group-enhanced {
          margin-bottom: 1.5rem !important;
        }
        .contact-textarea {
          min-height: 140px !important;
          resize: vertical !important;
        }
        
        /* Enhanced FAQ Styles */
        .faq-container {
          background: #ffffff !important;
        }
        .faq-card {
          border: 2px solid rgba(64, 64, 64, 0.08) !important;
          border-radius: 16px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: #ffffff !important;
          margin-bottom: 1.5rem !important;
          overflow: hidden !important;
        }
        .faq-card:hover {
          border-color: rgba(64, 64, 64, 0.2) !important;
          box-shadow: 0 12px 32px rgba(64, 64, 64, 0.1) !important;
          transform: translateY(-4px) !important;
        }
        .faq-question {
          background: #ffffff !important;
          border: none !important;
          padding: 24px !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          text-align: left !important;
        }
        .faq-question:hover {
          background: rgba(64, 64, 64, 0.02) !important;
        }
        .faq-question:focus {
          outline: none !important;
          box-shadow: inset 0 0 0 2px rgba(64, 64, 64, 0.1) !important;
        }
        .faq-question-text {
          color: #1d1d1b !important;
          font-weight: 600 !important;
          font-size: 1.1rem !important;
          margin: 0 !important;
          letter-spacing: -0.01em !important;
          flex: 1 !important;
        }
        .faq-icon {
          color: #404040 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          width: 24px !important;
          height: 24px !important;
          border: 2px solid #404040 !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          margin-left: 16px !important;
        }
        .faq-icon.rotated {
          transform: rotate(45deg) !important;
          background: #404040 !important;
          color: #ffffff !important;
        }
        .faq-answer {
          max-height: 0 !important;
          overflow: hidden !important;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                      padding 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          padding: 0 24px !important;
        }
        .faq-answer.expanded {
          max-height: 200px !important;
          padding: 0 24px 24px 24px !important;
        }
        .faq-answer-content {
          color: #404040 !important;
          font-size: 1rem !important;
          line-height: 1.6 !important;
          margin: 0 !important;
          padding-top: 16px !important;
          border-top: 1px solid rgba(64, 64, 64, 0.1) !important;
        }
        .faq-section-header {
          color: #1d1d1b !important;
          font-weight: 700 !important;
          margin-bottom: 2rem !important;
          text-align: center !important;
        }
        .faq-section-subtitle {
          color: #404040 !important;
          font-size: 1.25rem !important;
          text-align: center !important;
          margin-bottom: 3rem !important;
        }
        
        /* Enhanced Get in Touch Section */
        .hero-gradient {
          background: linear-gradient(135deg, #1d1d1b 0%, #2c2c2c 50%, #1d1d1b 100%) !important;
          position: relative !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-top: 76px !important;
        }
        .hero-gradient::before {
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
        .hero-content {
          position: relative !important;
          z-index: 2 !important;
        }
        .hero-title {
          color: #ffffff !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
          margin-bottom: 1.5rem !important;
        }
        .hero-subtitle {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 1.25rem !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
          letter-spacing: -0.01em !important;
        }
        
        /* Enhanced Contact Info Section */
        .contact-info-section {
          background: #1d1d1b !important;
          border-radius: 20px !important;
          padding: 3rem !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .contact-info-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(64, 64, 64, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .contact-info-header {
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 2rem !important;
          margin-bottom: 2.5rem !important;
          letter-spacing: -0.02em !important;
          position: relative !important;
          z-index: 2 !important;
        }
        .contact-info-header::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 80px;
          height: 4px;
          background: linear-gradient(135deg, #404040, #ffffff);
          border-radius: 2px;
        }
        .contact-info-item {
          background: rgba(64, 64, 64, 0.1) !important;
          border-radius: 16px !important;
          padding: 1.5rem !important;
          margin-bottom: 1.5rem !important;
          border: 1px solid rgba(64, 64, 64, 0.2) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          z-index: 2 !important;
        }
        .contact-info-item:hover {
          background: rgba(64, 64, 64, 0.15) !important;
          border-color: rgba(64, 64, 64, 0.4) !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2) !important;
        }
        .contact-info-title {
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 1.2rem !important;
          margin-bottom: 1rem !important;
          letter-spacing: -0.01em !important;
        }
        .contact-info-text {
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 1rem !important;
          line-height: 1.6 !important;
          margin-bottom: 0.5rem !important;
        }
        .contact-info-text:last-child {
          margin-bottom: 0 !important;
        }
        .enhanced-contact-icon {
          width: 64px !important;
          height: 64px !important;
          background: linear-gradient(135deg, #404040 0%, #ffffff 100%) !important;
          color: #1d1d1b !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-right: 1.5rem !important;
          flex-shrink: 0 !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 8px 24px rgba(64, 64, 64, 0.2) !important;
        }
        .enhanced-contact-icon:hover {
          transform: scale(1.15) rotate(10deg) !important;
          box-shadow: 0 16px 40px rgba(64, 64, 64, 0.3) !important;
        }
        
        /* Professional Contact Action Buttons */
        .contact-action-btn {
          background: linear-gradient(135deg, #404040 0%, #1d1d1b 100%) !important;
          border: 2px solid #404040 !important;
          color: #ffffff !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          margin-top: 0.75rem !important;
          margin-right: 0.75rem !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .contact-action-btn:hover {
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%) !important;
          color: #1d1d1b !important;
          border-color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(64, 64, 64, 0.3) !important;
        }
        .contact-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .contact-action-btn:hover::before {
          left: 100%;
        }
        
        /* Enhanced Hero Section Layout */
        .hero-section-enhanced {
          min-height: 60vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .hero-content-wrapper {
          text-align: center !important;
          max-width: 800px !important;
          margin: 0 auto !important;
        }
        .hero-description {
          font-size: 1.1rem !important;
          line-height: 1.8 !important;
          color: rgba(255, 255, 255, 0.85) !important;
          margin: 2rem 0 !important;
        }
        `}
      </style>
      {/* Enhanced Hero Section */}
      <section className="hero-gradient hero-section-enhanced">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="hero-content hero-content-wrapper">
                <h1 className="display-2 hero-title">Get in Touch</h1>
                <p className="hero-subtitle">
                  We'd love to hear from you. Send us a message and we'll
                  respond as soon as possible.
                </p>
                <p className="hero-description">
                  Our dedicated team is here to help with any questions about
                  our products, provide technical support, or assist with your
                  orders. Whether you're a professional photographer or just
                  getting started, we're committed to providing exceptional
                  customer service and support.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form and Info */}
      <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
        <Container>
          <Row className="g-5">
            {/* Contact Form */}
            <Col lg={6}>
              <Card className="h-100 contact-form-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #404040, #1d1d1b)",
                        color: "#ffffff",
                      }}
                    >
                      <Send size={28} />
                    </div>
                    <h2 className="form-section-header text-center">
                      Send us a Message
                    </h2>
                    <p
                      className="mb-0"
                      style={{
                        color: "#404040",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                      }}
                    >
                      We'd love to hear from you. Fill out the form below and
                      we'll get back to you as soon as possible.
                    </p>
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <div className="form-group-enhanced">
                      <Form.Label className="contact-label">
                        Full Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="contact-input"
                      />
                    </div>
                    <div className="form-group-enhanced">
                      <Form.Label className="contact-label">
                        Email Address *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="contact-input"
                      />
                    </div>
                    <div className="form-group-enhanced">
                      <Form.Label className="contact-label">
                        Subject *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                        className="contact-input"
                      />
                    </div>
                    <div className="form-group-enhanced">
                      <Form.Label className="contact-label">
                        Message *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                        className="contact-input contact-textarea"
                      />
                    </div>
                    <div className="form-group-enhanced mb-0">
                      <Button
                        type="submit"
                        className="w-100 d-flex align-items-center justify-content-center gap-3 contact-submit-btn"
                      >
                        <Send size={20} />
                        <span>Send Message</span>
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Enhanced Contact Information */}
            <Col lg={6}>
              <div className="contact-info-section h-100">
                <h2 className="contact-info-header">Contact Information</h2>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-start contact-info-item">
                    <div className="enhanced-contact-icon">
                      <Mail size={30} />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="contact-info-title">Email Us</h3>
                      <p className="contact-info-text">
                        General Inquiries: info@axg.com
                      </p>
                      <p className="contact-info-text">
                        Support: support@axg.com
                      </p>
                      <p className="contact-info-text">Sales: sales@axg.com</p>
                      <div className="mt-3">
                        <a
                          href="mailto:info@axg.com"
                          className="contact-action-btn"
                        >
                          <Mail size={16} />
                          Send Email
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start contact-info-item">
                    <div className="enhanced-contact-icon">
                      <Phone size={30} />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="contact-info-title">Call Us</h3>
                      <p className="contact-info-text">
                        Main: +1 (555) 123-4567
                      </p>
                      <p className="contact-info-text">
                        Support: +1 (555) 123-4568
                      </p>
                      <p className="contact-info-text">
                        Toll-Free: 1-800-AXG-GEAR
                      </p>
                      <div className="mt-3">
                        <a
                          href="tel:+15551234567"
                          className="contact-action-btn"
                        >
                          <Phone size={16} />
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start contact-info-item">
                    <div className="enhanced-contact-icon">
                      <MapPin size={30} />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="contact-info-title">Visit Us</h3>
                      <p className="contact-info-text">123 Creative Street</p>
                      <p className="contact-info-text">Photo City, PC 12345</p>
                      <p className="contact-info-text">United States</p>
                      <div className="mt-3">
                        <a
                          href="https://maps.google.com/?q=123+Creative+Street,+Photo+City,+PC+12345"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-action-btn"
                        >
                          <MapPin size={16} />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start contact-info-item">
                    <div className="enhanced-contact-icon">
                      <Clock size={30} />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="contact-info-title">Business Hours</h3>
                      <p className="contact-info-text">
                        Monday - Friday: 9:00 AM - 6:00 PM EST
                      </p>
                      <p className="contact-info-text">
                        Saturday: 10:00 AM - 4:00 PM EST
                      </p>
                      <p className="contact-info-text">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-5 faq-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-4 faq-section-header">
                  Frequently Asked Questions
                </h2>
                <p className="faq-section-subtitle">
                  Find quick answers to common questions about our products and
                  services
                </p>
              </div>

              <div className="faq-list">
                {faqData.map((faq, index) => (
                  <div key={index} className="faq-card">
                    <button
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={expandedFAQ === index}
                    >
                      <h3 className="faq-question-text">{faq.question}</h3>
                      <div
                        className={`faq-icon ${
                          expandedFAQ === index ? "rotated" : ""
                        }`}
                      >
                        +
                      </div>
                    </button>
                    <div
                      className={`faq-answer ${
                        expandedFAQ === index ? "expanded" : ""
                      }`}
                    >
                      <p className="faq-answer-content">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
