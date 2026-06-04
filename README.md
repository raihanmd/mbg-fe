# MetaMask Snap DCA Skills

This project is a MetaMask Snap that adds a skill-based wallet experience for automated investing strategies.

The main idea is simple:

- Users open a wallet flow like `DCA BTC`, `DCA ETH`, or other assets.
- They choose a schedule such as `1 week`, `1 month`, or another interval.
- An AI layer reasons about the strategy and helps determine the best execution timing.
- The snap coordinates the user experience and passes the chosen skill to the smart account flow.

This is meant to evolve into a MetaMask-native skill marketplace where users can install automated strategies such as:

- Dollar-cost averaging for BTC, ETH, and other tokens
- Voting or governance automation such as veAERO voting
- Other on-chain actions that can run with explicit, auditable, and revocable permissions

The backend is intended to be built with NestJS and expose the services needed to manage skills, strategy metadata, and permissioned execution.

## What This Project Does

- Provides a MetaMask Snap UI for strategy selection
- Lets users configure DCA frequency and asset choice
- Supports multiple assets, not just BTC
- Uses AI reasoning to help decide when to buy based on the selected skill
- Prepares the foundation for a marketplace of wallet skills

## Example User Flow

1. User opens the snap in MetaMask.
2. User selects a skill like `DCA BTC` or `DCA ETH`.
3. User chooses a cadence such as `1 week` or `1 month`.
4. The AI layer evaluates the strategy and suggests an execution plan.
5. The smart account executes the action under user-approved permissions.

## Project Structure

- `packages/snap`: MetaMask Snap implementation
- `packages/site`: Front-end for interacting with the snap

## Getting Started

### Requirements

- Node.js `>=18.6.0`
- Yarn `3.2.1`
- MetaMask Flask for local Snap development

### Install Dependencies

```shell
yarn install
```

### Run the Project Locally

Start the snap and the front-end together:

```shell
yarn start
```

If you want to run each package separately:

```shell
yarn workspace snap start
yarn workspace site start
```

## How to Install the MetaMask Snap

1. Install [MetaMask Flask](https://metamask.io/flask/) in your browser.
2. Start the project locally with `yarn start`.
3. Open the front-end at the local site URL shown in the terminal.
4. Connect MetaMask Flask to the local site.
5. Click the install or connect button for the snap.
6. Approve the snap permissions in MetaMask Flask.
7. The snap will then be available inside MetaMask for testing DCA skills.

## How to Use the Custom Wallet Flow

1. Open the wallet UI.
2. Choose a skill such as `DCA BTC`, `DCA ETH`, or another supported asset.
3. Pick the cadence, such as `1 week` or `1 month`.
4. Confirm the strategy.
5. The AI layer can reason about the best execution timing.
6. The smart account executes according to the approved permissions.

## Development Notes

- This repository is for building and testing the snap experience locally.
- MetaMask Flask is typically required for snap development.
- The long-term architecture should keep user permissions explicit, auditable, and revocable.

## Roadmap

- DCA skill UI for BTC, ETH, and other assets
- Schedule selection for weekly, monthly, and custom intervals
- AI-assisted strategy reasoning
- NestJS backend for skill orchestration
- Skill marketplace support for additional automated wallet behaviors

## License

This project inherits the license of the repository template unless changed later.
