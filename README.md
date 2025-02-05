# nzchin 

Chainscout is an explorer for Blockscout instances, allowing users to easily search and filter through various blockchain networks and projects using Blockscout.

## Table of Contents

- [Chainscout](#chainscout)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
    - [Adding a New Chain](#adding-a-new-chain)
    - [Adding an Explorer to an Existing Chain](#adding-an-explorer-to-an-existing-chain)

## Features

- Search functionality for chains and projects
- Filtering by hosting provider, network type, and ecosystem
- Responsive design for various screen sizes
- Pagination for easy navigation through results

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/blockscout/chainscout.git
```
2. Navigate to the project directory:
```bash
cd chainscout
```
3. Install dependencies:
```bash
npm install
# or
yarn install
```
4. Run the development server:
```bash
npm run dev
# or
yarn dev
```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

Use the search bar to find specific chains or projects. Apply filters to narrow down results based on hosting provider, network type, or ecosystem.

## Contributing

We welcome contributions to Chainscout! Here's how you can help:

### Adding a New Chain

1. Fork the repository and create a new branch for your addition.
2. Open the file `data/chains.json`.
3. Add a new entry for the chain, following the existing format:

```json
"chainId": {
  "name": "Chain Name",
  "description": "Brief description of the chain",
  "ecosystem": ["Associated ecosystem (e.g., Ethereum, Polkadot)"],
  "isTestnet": false,
  "layer": 1,
  "rollupType": null,
  "website": "https://chain-website.com",
  "explorers": [
    {
      "url": "https://explorer-url.com",
      "hostedBy": "blockscout"
    }
  ],
  "logo": "https://example.com/path/to/logo.png"
}
```
4. If the logo URL uses a new domain, add it to the `images.domains` array in `next.config.mjs`:
```javascript
module.exports = {
  images: {
    domains: [
      'existing-domain.com',
      'new-logo-domain.com'
    ],
  },
};
```
5. Create a pull request with your changes.

### Adding an Explorer to an Existing Chain

1. Fork the repository and create a new branch for your addition.
2. Open the file data/chains.json.
3. Find the entry for the chain you want to update.
4. Add a new object to the explorers array:
```json
"explorers": [
  {
    "url": "https://new-explorer-url.com",
    "hostedBy": "hosting-provider"
  }
]
```
5. Create a pull request with your changes.

Please ensure your contributions adhere to our coding standards and include appropriate documentation.
