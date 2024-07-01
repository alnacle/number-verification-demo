const phoneInputField = document.querySelector("#phone");
const form = document.querySelector("#login");

window.intlTelInput(phoneInputField, {
  initialCountry: "es",
  onlyCountries: ["es", "de"],
  strictMode: true,
});

async function sendData() {

  const data = new URLSearchParams();
  for (const pair of new FormData(form)) {
    data.append(pair[0], pair[1]);
  }

  // Request auth request
  try
  {
    const authResponse = await fetch('/login', {
      method: "POST",
      mode: "no-cors",
      body: data
    });
    authURL= await authResponse.json();
  } catch (error) {
    console.log(error);
  }

  // Redirect to the auth url
  setTimeout(
    function() {
      window.location.replace(authURL.url);
    }, 10000);
}

form.addEventListener("submit", (event) => {

  const loginButton = document.getElementById('login-button');
  const loadingIcon = document.getElementById('loading-icon');

  loadingIcon.classList.remove('hidden');
  loginButton.classList.add('hidden');
  
  event.preventDefault();
  sendData();
});
