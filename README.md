# Fumadocs Maven

Generate code blocks for maven/gradle installing packages

To install dependencies:

```bash
npm install fumadocs-maven
```

```bash
pnpm install fumadocs-maven
```

```bash
yarn add fumadocs-maven
```

```bash
bun add fumadocs-maven
```

## Usage

Add the remark plugin to your `next.config.mjs`:

```javascript
import { remarkMaven } from 'fumadocs-maven';

const config = {
    remarkPlugins: [
      [remarkMaven, { ... }]
    ],
}
```

Define the Tab component in `mdx-components.tsx`:

```javascript
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    Tab,
    Tabs,
  };
}
```

Create code blocks with package-maven as language.

```package-maven
org.springframework.boot:spring-boot-starter-web:3.0.0
```
