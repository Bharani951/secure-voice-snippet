// Validate email format
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 6 characters, with at least one number or special character
  const regex = /^(?=.*[0-9!@#$%^&*])(.{6,})$/;
  return regex.test(password);
};

// Validate form field
export const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!value || value.trim().length < 2) {
        return "Name must be at least 2 characters";
      }
      break;
    case "email":
      if (!isValidEmail(value)) {
        return "Please enter a valid email address";
      }
      break;
    case "password":
      if (!isStrongPassword(value)) {
        return "Password must be at least 6 characters with at least one number or special character";
      }
      break;
    case "confirmPassword":
      if (value !== document.getElementById("password")?.value) {
        return "Passwords do not match";
      }
      break;
    case "title":
      if (!value || value.trim().length < 1) {
        return "Title is required";
      }
      break;
    default:
      return null;
  }
  return null;
};

// Validate form data
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  for (const field of requiredFields) {
    if (!formData[field]) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
  }

  return errors;
};
