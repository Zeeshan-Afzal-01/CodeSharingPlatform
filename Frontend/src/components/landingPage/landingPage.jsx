import React,{useState} from "react";
import './landingPage.css'
const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill out all fields.");
      return;
    }

    // Simulate form submission
    alert("Thank you for your message! We will get back to you soon.");
    setFormSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      question: "How secure is my code on CodeShare?",
      answer:
        "Your code is protected with enterprise-grade security. We use end-to-end encryption, secure authentication, and provide granular access controls for team collaboration.",
    },
    {
      question: "Can I use CodeShare with my existing development tools?",
      answer:
        "Yes! CodeShare integrates seamlessly with popular IDEs, version control systems, and development tools. We provide APIs and plugins for major platforms.",
    },
    {
      question: "What programming languages are supported?",
      answer:
        "CodeShare supports all major programming languages including JavaScript, Python, Java, C++, Ruby, PHP, and many more. Our syntax highlighting and code formatting work with 100+ languages.",
    },
    {
      question: "How does team collaboration work?",
      answer:
        "Teams can work together in real-time with live editing, comments, and version control. You can set different access levels, create team workspaces, and track changes efficiently.",
    },
    {
      question: "Is there a limit to how many snippets I can store?",
      answer:
        "Free accounts can store up to 10 snippets. Pro and Enterprise plans offer unlimited snippet storage with advanced organization features.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const features = [
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      ),
      title: "Code Snippet Management",
      description:
        "Create, organize, and share code snippets with syntax highlighting for all popular programming languages.",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      title: "Team Collaboration",
      description:
        "Create teams, assign roles, and collaborate in real-time with team members on shared projects.",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      ),
      title: "Secure Sharing",
      description:
        "Advanced security features with encrypted storage and granular access controls for your code.",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      title: "Meeting Scheduler",
      description:
        "Schedule and manage team meetings with integrated calendar and reminder features.",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
      title: "Version Control",
      description:
        "Track changes with built-in version control and rollback capabilities for your code.",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      ),
      title: "Real-time Updates",
      description:
        "Get instant notifications and updates on code changes and team activities.",
    },
  ];
  const steps = [
    {
      number: "1",
      title: "Create Your Workspace",
      description:
        "Sign up and create your personal or team workspace. Set up your profile and customize your development environment preferences.",
      code: `workspace.create({
  name: 'My Team',
  type: 'team',
  members: ['john@dev.com', 'sarah@dev.com']
});`,
      iconPath: `M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z`,
      animation: "fade-left",
    },
    {
      number: "2",
      title: "Share Code Snippets",
      description:
        "Upload your code snippets, organize them into collections, and share them with your team members securely.",
      code: `snippet.share({
  code: 'const hello = "world"',
  language: 'javascript',
  access: 'team',
  expiry: '7days'
});`,
      iconPath: `M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z`,
      animation: "fade-right",
    },
    {
      number: "3",
      title: "Collaborate in Real-time",
      description:
        "Work together with your team in real-time, leave comments, and track changes efficiently.",
      code: `collaboration.start({
  snippetId: 'abc123',
  mode: 'realtime',
  participants: team.members
});`,
      iconPath: `M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z`,
      animation: "fade-left",
    },
  ];
  
  
  return (
    <main>
    <section
      className="d-flex flex-column flex-lg-row align-items-center justify-content-between px-4 px-lg-5 py-5"
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Left Content */}
      <div className="text-center text-lg-start mb-5 mb-lg-0 w-100 w-lg-50">
        <h1 className="fw-bold display-4">
          Collaborate & Share{" "}
          <span style={{ color: "#3B82F6" }}>Code Seamlessly</span>
        </h1>
        <p className="mt-4 fs-5 text-light">
          A powerful platform for developers to share code snippets, collaborate
          with teams, and manage projects efficiently in one secure space.
        </p>
        <div className="mt-4 d-flex justify-content-center justify-content-lg-start">
          <button
            className="btn btn-primary btn-lg me-3"
            style={{
              backgroundColor: "#3B82F6",
              borderColor: "#3B82F6",
              borderRadius: "8px",
            }}
          >
            Get Started Free
          </button>
          <button
            className="btn btn-outline-light btn-lg"
            style={{
              borderRadius: "8px",
            }}
          >
            Watch Demo
          </button>
        </div>
        <div className="mt-4 text-center text-lg-start">
          <p className="text-success fw-bold d-flex align-items-center justify-content-center justify-content-lg-start mb-2">
            <i className="bi bi-check-circle-fill me-2"></i> No credit card
            required
          </p>
          <p className="text-success fw-bold d-flex align-items-center justify-content-center justify-content-lg-start">
            <i className="bi bi-check-circle-fill me-2"></i> Free 14-day trial
          </p>
        </div>
      </div>

      {/* Right Code Snippet */}
      <div className="w-100 w-lg-50 d-flex justify-content-center justify-content-lg-end">
        <div
          className="bg-dark text-light p-4 rounded position-relative"
          style={{
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
            borderRadius: "12px",
          }}
        >
          <pre
            className="m-0"
            style={{
              color: "#A3A3A3",
              fontFamily: "Consolas, monospace",
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            <code>
              {`// Example Code Sharing
class CodeSnippet {
  constructor() {
    this.language = "JavaScript";
    this.collaborative = true;
  }

  share() {
    return "Sharing code made easy!";
  }
}

// Real-time collaboration
const team = new Team();
team.collaborate();`}
            </code>
          </pre>
          <button
            className="btn btn-primary position-absolute"
            style={{
              bottom: "-20px",
              right: "20px",
              backgroundColor: "#3B82F6",
              borderColor: "#3B82F6",
              fontSize: "0.9rem",
              borderRadius: "8px",
            }}
          >
            Real-time editing
          </button>
        </div>
      </div>
    </section>
    <section className="py-5 bg-white" id="features">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-5 text-dark">
            Powerful Features for Seamless Collaboration
          </h2>
          <p className="text-muted fs-5">
            Everything you need to manage code snippets and collaborate with
            your team efficiently
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="col-12 col-md-6 col-lg-4 animate__animated animate__fadeInUp"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="p-4 bg-light rounded-3 shadow-sm hover-shadow transition-all">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: "48px", height: "48px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-primary"
                    width="24"
                    height="24"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="fw-semibold fs-5 text-dark">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section id="howItWorks" className=" text-white py-5" style={{backgroundColor:"#171717"}}>
      <div className="container ">
        {/* Title Section */}
        <div className="text-center mb-5 ">
          <h2 className="fw-bold display-5">How CodeShare Works</h2>
          <p className="text-white fs-5">Get started with CodeShare in three simple steps</p>
        </div>

        {/* Steps Section */}
        <div className="d-flex flex-column gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`row align-items-center ${
                index % 2 === 0 ? "" : "flex-row-reverse"
              }`}
              data-aos={step.animation}
            >
              {/* Text and Code Block */}
              <div className="col-md-6">
                <div className=" p-4 rounded-3" style={{backgroundColor:"#262626"}}>
                  <div className="d-flex align-items-center mb-3">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fs-5 fw-bold" style={{ width: "40px", height: "40px" }}>
                      {step.number}
                    </span>
                    <h3 className="ms-3 fw-bold">{step.title}</h3>
                  </div>
                  <p className="text-white">{step.description}</p>
                  <div className=" p-3 rounded-3" style={{backgroundColor:"#404040"}}>
                    <pre style={{color:"#6a9df5"}}>{step.code}</pre>
                  </div>
                </div>
              </div>

              {/* Icon Block */}
              <div className="col-md-6 d-flex justify-content-center">
                <div className="position-relative">
                  <div
                    className="bg-primary bg-opacity-25 rounded-circle position-absolute"
                    style={{
                      width: "200px",
                      height: "200px",
                      animation: "pulse 2s infinite",
                    }}
                  ></div>
                  <div
                    className=" rounded-circle d-flex align-items-center justify-content-center position-relative"
                    style={{ width: "200px",backgroundColor:"#262626", height: "200px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ width: "100px", height: "100px", color: "#3b82f6" }}
                    >
                      <path d={step.iconPath} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section id="faq" className="bg-white py-5">
      <div className="container">
        {/* Title Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold display-5 text-dark">
            Frequently Asked Questions
          </h2>
          <p className="text-muted fs-5">
            Find answers to common questions about CodeShare
          </p>
        </div>

        {/* FAQ Items */}
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`accordion-item border-0 shadow-sm mb-3 ${
                index === openIndex ? "animate__animated animate__fadeInUp" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    openIndex === index ? "" : "collapsed"
                  } bg-white text-dark fw-semibold`}
                  type="button"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${
                  openIndex === index ? "show" : ""
                }`}
              >
                <div className="accordion-body text-muted">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section id="contact" className=" text-white py-5" style={{backgroundColor:"#171717"}}>
      <div className="container">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold display-5">Get in Touch</h2>
          <p className="text-white fs-5">We are here to help and answer any question you might have.</p>
        </div>

        {/* Form Section */}
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <form onSubmit={handleSubmit} className="p-4 rounded-3 shadow-lg" style={{backgroundColor:"#171717"}}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label text-light">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control bg-dark border-0 text-light"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="form-label text-light">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control bg-dark border-0 text-light"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="form-label text-light">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="form-select bg-dark border-0 text-light"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="form-label text-light">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="form-control bg-dark border-0 text-light"
                  placeholder="Write your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 py-3"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-5 row text-center g-4">
          <div className="col-md-4">
            <div className=" p-4 rounded-3 shadow-sm contactFieldColor">
              <i className="bi bi-envelope-fill text-primary fs-2 mb-3"></i>
              <h5 className="fw-bold">Email Us</h5>
              <p className="text-light">zna152191@gmail.com</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className=" p-4 rounded-3 shadow-sm contactFieldColor">
              <i className="bi bi-telephone-fill text-primary fs-2 mb-3"></i>
              <h5 className="fw-bold">Call Us</h5>
              <p className="text-light">+92 (34) 36185737</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contactFieldColor p-4 rounded-3 shadow-sm">
              <i className="bi bi-geo-alt-fill text-primary fs-2 mb-3"></i>
              <h5 className="fw-bold">Visit Us</h5>
              <p className="text-light">Lahore</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
};

export default LandingPage;