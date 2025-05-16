
/**
 * Utility functions for testing components and features
 */

/**
 * Test if a component renders without crashing
 * 
 * @param Component The React component to test
 * @param props Optional props to pass to the component
 * @returns true if the component renders without errors
 */
export const testComponentRender = (Component: React.ComponentType<any>, props = {}) => {
  try {
    const element = document.createElement('div');
    ReactDOM.render(<Component {...props} />, element);
    ReactDOM.unmountComponentAtNode(element);
    return true;
  } catch (error) {
    console.error("Component render test failed:", error);
    return false;
  }
};

/**
 * Check for accessibility issues in the current document
 * This is a simple implementation - a real app would use a tool like axe-core
 */
export const checkAccessibility = () => {
  const issues = [];
  
  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`Found ${imagesWithoutAlt.length} image(s) without alt text`);
  }
  
  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const inputId = input.getAttribute('id');
    if (inputId && !document.querySelector(`label[for="${inputId}"]`)) {
      issues.push(`Input with id "${inputId}" has no associated label`);
    }
  });
  
  // Check for insufficient color contrast (simplified)
  // A real implementation would use WCAG color contrast algorithms
  
  // Check for keyboard navigability (simplified)
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
  interactiveElements.forEach(el => {
    const tabIndex = el.getAttribute('tabindex');
    if (tabIndex === '-1' && !el.getAttribute('aria-hidden')) {
      issues.push(`Interactive element not keyboard navigable: ${el.tagName}${el.id ? `#${el.id}` : ''}`);
    }
  });
  
  return {
    hasIssues: issues.length > 0,
    issues,
  };
};

// Add React import to be used in testing
import React from 'react';
import ReactDOM from 'react-dom';
