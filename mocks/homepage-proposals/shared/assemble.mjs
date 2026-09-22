import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const concepts = [1, 2, 3].map(number => {
  const folder = path.join(directory, `proposal-0${number}`);
  const concept = JSON.parse(fs.readFileSync(path.join(folder, 'concept.json'), 'utf8'));
  if (!concept.name || !concept.thesis || !concept.tradeoff || !Array.isArray(concept.distinctiveChoices)) {
    throw new Error(`Proposal ${number} is missing its comparison description.`);
  }
  for (const file of ['index.html', 'desktop.png', 'mobile.png']) {
    if (!fs.existsSync(path.join(folder, file))) {
      throw new Error(`Proposal ${number} is missing ${file}.`);
    }
  }
  return concept;
});
fs.writeFileSync(path.join(directory, 'concepts.js'), `window.HOMEPAGE_CONCEPTS = ${JSON.stringify(concepts, null, 2)};\n`, 'utf8');
console.log(concepts.map((concept, index) => `${index + 1}. ${concept.name}`).join('\n'));
