document.addEventListener('DOMContentLoaded', () => {
  const citizenLoginButton = document.getElementById('citizenLoginButton');

  if (citizenLoginButton) {
    citizenLoginButton.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }
});