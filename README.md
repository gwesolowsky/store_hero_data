# Store Hero Data

Web scraper that fetches the 4 latest movie releases from Sky Store and outputs structured data for Adobe Campaign personalisation blocks.

## What it does

- Acquires title, image URL, and link for the first 4 movies on Store 'new to buy' page
- Outputs data to terminal and saves to `movies.json`

## Setup

Node.js must be installed. You can install it from Self Service.

```bash
npm install
```

## Usage

```bash
node index.js
```

The script will display a loading spinner while fetching data, then output the results and save them to `movies.json`.

## Output Format

```json
{
  "title1": "Movie Title",
  "image1": "https://...",
  "link1": "https://www.skystore.com/...",
  "title2": "Movie Title",
  "image2": "https://...",
  "link2": "https://www.skystore.com/...",
  ...
}
```

## Adobe Campaign

Use the generated `movies.json` data to update personalisation blocks in Adobe Campaign with the latest movie releases. The block is named `Sky_Store_Dynamic_Hero` and can be found under `Resources > Campaign Management > Personalisation blocks`
