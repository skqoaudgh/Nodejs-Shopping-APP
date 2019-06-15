var stripe = Stripe('pk_test_1LEAer1QfhJ6v5nBE5lf4OPz00pPqoZfpZ');
var elements = stripe.elements();

var style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
};

var card = elements.create('card', {style: style});
card.mount('#card-element');

card.addEventListener('change', function(event) {
    var displayError = document.getElementById('charge-error');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
});

var form = document.getElementById('checkout-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    var btn = document.getElementById('btn');
    var name = document.getElementById('name');
    var address = document.getElementById('address');

    btn.disabled = true;

    stripe.createToken(card, {
      name: name.value,
      address_line1: address.value
    }).then(function(result) {
        if (result.error) {
            // Inform the customer that there was an error.
            var errorElement = document.getElementById('charge-error');
            errorElement.textContent = result.error.message;
            btn.disabled = false;
        } else {
            // Send the token to your server.
            stripeTokenHandler(result.token);
            btn.disabled = true;
        }
    });
});

function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('checkout-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
  
    // Submit the form
    form.submit();
}