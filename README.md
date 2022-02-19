# Introduction

This project would not have been possible without the dedicated guidance of [Zachary Reece](https://www.udemy.com/user/zacharyreece/) and his  support throughout the process.
The project is intended to demonstrate what I've learnt about [React](https://reactjs.org/), [Gatsby](https://www.gatsbyjs.com/), [Material UI](https://mui.com/) and serves as a component for my résumé.

## Usage

You can have have a look and play around with the UI by visiting the [live demo](https://locostore.netlify.app/). When the page loads for the **first** time (especially if you open it in the Incognito window), the layout *maybe* broken (I honestly don't know why, and if you happen to know the cause of that issue, I'd love to know how to fix it). In that case, refresh the page and it'll work.

I do want to deploy the project with all of its functionality, but that requires maintaining the [AWS EC2 instance](https://aws.amazon.com/ec2/) to keep the backend running, whose usage exceeds the [Free Tier's limit](https://aws.amazon.com/ec2/pricing/?loc=ft#Free_tier) so... long story short, I'll have to pay for service to keep it working, which, you know, as a fresh graduate, it's out of my financial capability. 

## Caveats
The project has responsive design, however, for devices with 320px width it may look a bit off in some sections.

## Installation

If you want to try out the fully functional version of the project, you'll have to run it locally and make sure to have the same environment as I do to get it working properly. Please download and install these 2 softwares if you don't have them already:
1.  **nvm-setup.zip** from its [latest release](https://github.com/coreybutler/nvm-windows/releases)
2.  [Git](https://git-scm.com/downloads)

Then open up your terminal with Admin privilege and run:
1. `nvm install 14.15.0` 
2. `nvm use 14.15.0` 
3. `node -v` (the output should be `v14.15.0`)
4. Pick a folder of your choice or create an empty folder and then `cd path-to-that-folder`
5. `git clone https://github.com/HelpMe-Pls/JAMStack-site.git`
6. `cd JAMStack-site`
7. Proceed with the instructions from the [backend](https://github.com/HelpMe-Pls/JAMStack-site/blob/master/backend/README.md) and [frontend](https://github.com/HelpMe-Pls/JAMStack-site/blob/master/frontend/README.md) folders *respectively*.

## What I've learnt
- General:
- Gatsby:
- Material UI:
- React:
- JavaScript:

## Known bugs
- Recently viewed products
- Unable to change subscription frequency in the list of subscriptions from User's profile

## Planned development
- Fix known bugs
- Further refractor code for readability
- Add functionality to "Search for products", "Pause subscription" and "Promo code" 
- Extend this project with a desktop app version of it (using [ElectronJS](https://www.electronjs.org/))
- Find other free alternatives to AWS EC2 for deploying the backend.

## Contributing
Pull requests are welcome. For suggesting changes, please open an issue first to discuss what you would like to change/improve.

Please make sure to [contact me](https://www.facebook.com/messages/t/100005341874318) if you need further support.

## License
[MIT](https://choosealicense.com/licenses/mit/)