/**
 * =======================================
 * PROJECT DATA
 * =======================================
 * This is the single source of truth for the project data.
 * It is an array of objects, where each object represents a project.
 */
// We declare 'projects' as a constant because the array itself will not be reassigned.
const projects = [
  {
    title: "Kanoj Art - Portfolio",
    description: "Kanoj Art is a modern responsive art portfolio website designed to showcase creative artwork and visual designs. Built using HTML, CSS, and JavaScript, the project focuses on clean UI, smooth navigation, and an engaging gallery layout. It also integrates Formspree as a Backend-as-a-Service (BaaS) to handle contact form submissions efficiently without building a custom backend. ",
    imageUrl: "./images/project1.webp",
    liveUrl: "https://kanoj-art-v-1-0.vercel.app/",
    codeUrl: "https://github.com/tushardumra/Kanoj_art-v-1.0",
  },
  {
    title: "Stelina - Ecommerce",
    description: "This project involves modifying an e-commerce website template, Stelina, using the MERN stack. I converted pages into components with React.js and created APIs with Express.js to facilitate communication with the backend. MongoDB serves as the data storage solution. For user authentication, I implemented JWT. Additionally, the project includes a separate admin panel that provides insights to the administrator.",
    imageUrl: "./images/project2.png",
    liveUrl: "https://stelina-1-xeyx.vercel.app/",
    codeUrl: "https://github.com/tushardumra/Stelina-1",
  },
  // {
  //   title: "Portfolio Project",
  //   description: "A responsive personal portfolio built from scratch using HTML, CSS, and vanilla JavaScript. Features a dynamic theme switcher and is populated by a JavaScript data structure.",
  //   imageUrl: "./images/project-placeholder-1 - Copy.jpg",
  //   liveUrl: "https://your-live-site.com",
  //   codeUrl: "https://github.com/your-username/your-repo-name",
  // },
  
];

// =======================================
// DOM ELEMENT SELECTIONS
// =======================================
// This line selects the HTML element with the ID 'theme-toggle' and stores a reference to it in a constant variable named 'themeToggle'.
// 'const' is used because this reference will not be reassigned to a different element later in our code.

// Select the theme toggle checkbox
const themeToggle = document.querySelector("#theme-toggle");

// NEW: Select the root <html> element of the document.
// We will add/remove the 'data-theme' attribute to this element to switch themes.
const htmlElement = document.documentElement;

// '.projects-container' gives us a direct "handle" to this specific div in the DOM.
const projectsContainer = document.querySelector(".projects-container");

// Selecting Contact Form and Form Status
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

/**
 * =======================================
 * RENDER PROJECTS FUNCTION
 * =======================================
 * This function is responsible for rendering the project cards to the DOM.
 */
const renderProjects = () => {
  // 1. Create an empty string to hold all the generated HTML.
  let allProjectsHtml = '';

  // 2. We iterate over the 'projects' array.
  projects.forEach(project => {

    // We create the HTML for a single card.
    const projectCardHtml = `
    <div class="project-card">
      <img
        src="${project.imageUrl}"
        alt="A screenshot of ${project.title} project"
        class="project-image"
      />
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <div class="project-links">
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live Demo</a>
        <a href="${project.codeUrl}" target="_blank" rel="noopener noreferrer">View Code</a>
      </div>
    </div>
    `;

    // 3. Instead of logging, we append the card's HTML to our 'allProjectsHTML' string.
    allProjectsHtml += projectCardHtml;
    
    // 4. After the loop has finished, we perform ONE update to the DOM.
  // This is far more efficient than updating the DOM in every loop iteration.
  projectsContainer.innerHTML = allProjectsHtml;

  })
};

// add an event listener to our theme toggle switch.
themeToggle.addEventListener('click', () => {
  // 1. Determine the new theme.
  const newTheme = themeToggle.checked ? 'dark'
: 'light';

// 2. Apply the new theme.
htmlElement.setAttribute('data-theme', newTheme);

// 3. Save the user's choice to localStorage.
localStorage.setItem("theme", newTheme);
});

// APPLY THE SAVED THEME ON PAGE LOAD
// We use an Immediately Invoked Function Expression (IIFE) to run this code once on script load.

(() => {
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);

    if(savedTheme === 'dark') {
      themeToggle.checked = true;
    }
  }
})();

/**
 * =======================================
 * INITIALIZATION
 * =======================================
 * This code runs after the entire page structure (DOM) is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  // When the DOM is ready, we call our function to render the projects.
  renderProjects();

  // --- ASYNCHRONOUS FORM SUBMISSION ---
  // Check if the contact form exists on the page before adding the listener.
  if(contactForm) {
    contactForm.addEventListener('submit', (event) => {
      // 1. Prevent the default form submission behavior (the page redirect).
      event.preventDefault();

      // 2. Collect the form data using the FormData API.
      const formData = new FormData(contactForm);
      const submitbutton = document.querySelector('button[type="submit"]');

      // Provide immediate user feedback: show a "sending" state.
      formStatus.innerHTML = 'Sending...';
      formStatus.className = 'info';
      formStatus.style.display = 'block'
      submitbutton.disabled = true;

      // 3. Use the fetch API to send the data.
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        // 4. Handle the response from the server.
        if(response.ok) {
          // Success! Show the success message.
          formStatus.innerHTML = "Thank you! Your message has been sent.";
          formStatus.className = 'success';
          // Clear the form fields after a successful submission.
          contactForm.reset();
        } else {
          // The server responded with an error. Try to parse the error message.
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              // This is a validation error from Formspree.
              formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
            } else {
              // This is a generic server error.
              formStatus.innerHTML = "Oops! Something went wrong. Please try again later.";
            }
            formStatus.className = 'error';
          })
        }
      }).catch(error => {
        // 5. Handle network errors (e.g., user is offline).
        formStatus.innerHTML = "Oops! A network error occurred. Please check your connection and try again.";
        formStatus.className = 'error';
      }).finally(() => {
         // Re-enable the submit button regardless of success or failure.
         submitbutton.disabled = false;
      })
    });
  }
});