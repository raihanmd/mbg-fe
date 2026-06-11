# SkillWallet* — AI-Powered DCA Automation

A MetaMask Snap enabling users to install and execute AI-powered DCA (Dollar-Cost Averaging) skills for automated trading.
## Description

SkillWallet* allows users to configure and execute DCA strategies using AI-driven skills. The available skills include:
- **Generic DCA**: Fixed USDC swaps into selected tokens at 9 AM daily.
- **AI-Powered DCA**: Optimized swaps using AI market analysis.
- **USDC Inbound DCA**: Swaps triggered by USDC incoming transfers.

## Features
- Configure daily USDC spend limits.
- Choose output tokens: WETH or cbBTC.
- Set fixed amounts or percentage-based spending.
- AI-driven execution for optimized trades.

## Installation
1. Install MetaMask.
2. Install the SkillWallet* Snap from the MetaMask store.
3. Configure your DCA skills through MetaMask.

## Usage
1. Open MetaMask and navigate to the SkillWallet* Snap.
2. Select your desired DCA skill.
3. Configure parameters:
   - Output token (WETH or cbBTC).
   - Amount of USDC to swap.
   - Daily spend limit.
   - Spend mode (fixed or percentage of inbound).
4. Enable the skill for automatic execution.

## Configuration
### Environment Variables
- `MM_API_KEY`: MetaMask API key (required for skill installation).
- `DEFAULT_CHAIN_ID`: Default chain ID for executions (default: 84532).
- `MAX_DAILY_SPEND`: Maximum allowed daily spend in USDC (default: 10000000).

### Skill Parameters
- `outputToken`: Token to accumulate (WETH or cbBTC).
- `amountUsdc`: Amount of USDC per run in base units.
- `dailySpendLimit`: Maximum daily spend in USDC.
- `spendMode`: Spend mode (fixed or percent-of-inbound).
- `percentOfInboundBps`: Percent of inbound amount in basis points.

## Contributing
1. Fork the repository.
2. Create a new branch for your changes.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## License
[Your License Here]

## Contact
For questions or support, contact syafiqpinginfullstack@gmail.com.
## Acknowledgments
- MetaMask for the Snap platform.
- AI and DeFi communities for inspiration
