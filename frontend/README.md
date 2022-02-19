## Installation
If you prefer using [Yarn](https://yarnpkg.com/), I suggest `v1.22.17`. The latest version `berry` doesn't seem to work after the installation step.
1. `cd ../frontend`
2. `npm i` or `yarn`
3. [Contact me](https://www.facebook.com/messages/t/100005341874318) if you get this far, I'll send you the `.env` file to run the project.
4. `npm run dev` or `yarn dev`
    The project should be accessible at `localhost:8000`. Now you can try out all of its functionality 

## Usage
#### As a guest (unregistered user):
- After adding the products to the cart and clicking on the cart icon in the header section, you should see the following forms:
  
![cart_1](/frontend/src/images/instructions/cart_1.png?raw=true "cart_1")

- If the **Billing** switch is *off*, you'll be directed to the **Billing Info** tab:
  
![cart_2](/frontend/src/images/instructions/cart_2.png?raw=true "cart_2")

- Same thing goes for **Address**, but if you turn the **Billing** switch *on*, you'll be directed to the **Shipping** tab:
  
![cart_3](/frontend/src/images/instructions/cart_3.png?raw=true "cart_3")

![cart_4](/frontend/src/images/instructions/cart_4.png?raw=true "cart_4")

![cart_5](/frontend/src/images/instructions/cart_5.png?raw=true "cart_5")

- Choose your desired shipping option, then move on the **Payment** tab:
    - Billing and Payment is handled by [Stripe](https://stripe.com/docs/testing#payment-intents-api), their testing card is `4242 4242 4242 4242`:
![cart_6](/frontend/src/images/instructions/cart_6.png?raw=true "cart_6")

- Move on to the **Confirmation** tab, you can review you info and edit the product list as well as the quantity for each product. The **Billing Info** and **Billing Address** fields (under the form) will not be displayed if the **Billing** switch is *on* in the **Contact Info** and/or **Address** tabs:
![cart_7](/frontend/src/images/instructions/cart_7.png?raw=true "cart_7")

- Finish the order by clicking on **Place Order**, and you'll be directed to the last tab:
![cart_8](/frontend/src/images/instructions/cart_8.png?raw=true "cart_8")

#### As a registered user:
- After your sign up/login, you can view your profile:
![User_1](/frontend/src/images/instructions/User_1.png?raw=true "User_1")
  
- In **Settings**, you can save and/or edit your info for your purchases:
![User_2](/frontend/src/images/instructions/User_2.png?raw=true "User_2")

- The process of placing order is similar to the "Unregistered" user, but now you can save your time with the saved info you set up in your **Settings** 

![User_3](/frontend/src/images/instructions/User_3.png?raw=true "User_3")

![User_4](/frontend/src/images/instructions/User_4.png?raw=true "User_4")

![User_5](/frontend/src/images/instructions/User_5.png?raw=true "User_5")

![User_6](/frontend/src/images/instructions/User_6.png?raw=true "User_6")

![User_7](/frontend/src/images/instructions/User_7.png?raw=true "User_7")
_check your "spam" email to see the invoice_

- You can also add a product to your Favorites or Subcription:
  
![User_8](/frontend/src/images/instructions/User_8.png?raw=true "User_8")

- After making purchases, adding favorites and/or subscriptions, you can view them in your profile at `localhost:8000/account`

- **Leave a review** and/or edit your review:

![User_9](/frontend/src/images/instructions/User_9.png?raw=true "User_9")

![User_10](/frontend/src/images/instructions/User_10.png?raw=true "User_10")

## Caveats


  
