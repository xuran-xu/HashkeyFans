# HashFans - HashKey Chain Community Hub

HashFans is the official community website for HashKey Chain, serving as a central platform for ecosystem updates, project showcases, and community engagement.

## About

HashFans connects builders, users, and enthusiasts within the HashKey Chain ecosystem. The platform features:

- 🎯 Latest ecosystem activities and campaigns
- 🚀 Featured projects building on HashKey Chain
- 📰 Network updates and news
- 🤝 Community engagement opportunities

## Features

- Multi-language support
- Project directory
- Event calendar
- Network statistics
- Community resources

## Submit Your Project

We welcome projects building on HashKey Chain to submit their information for listing. Please follow the format below:

```typescript
{
  id: "your-project-id",
  name: "Your Project Name",
  logo: "/path/to/logo.png", // Provide logo URL or file
  imgClassName: "h-8 w-auto", // Optional: Custom image styling
  link: "https://your-project-url.com",
  tags: ["category1", "category2"], // Choose from: infrastructure, bridge, wallet, RWA, defi, oracle, gaming, DeFi, Dex
  isVerified: false, // Will be reviewed by the team
  description: {
    en: "English description of your project (max 150 characters)",
    zh: "Chinese description of your project (max 150 characters)"
  },
  // Optional fields
  contractAddress: "0x...", // If applicable
  pointsBonus: {
    type: "interaction", // interaction | bonus | reward
    hasExtraPoints: false,
    description: {
      en: "Bonus description in English",
      zh: "Bonus description in Chinese"
    }
  },
  socials: [
    {
      platform: "x", // x | discord | telegram
      link: "https://x.com/your-handle"
    }
  ],
  buttons: [
    {
      text: "Button Text",
      link: "https://action-url.com"
    }
  ]
}
```

To submit your project:
1. Fork this repository
2. Add your project information to `src/data/projectsData.ts`
3. Create a pull request with the subject "Project Submission: [Project Name]"
4. Include any additional information or context in the PR description

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting PRs.

## Connect With Us

- Twitter: [@HashFans](https://x.com/HashKeyfans)
- Discord: [Join our community](https://discord.gg/hashkey)

## License

MIT License - see LICENSE.md for details
