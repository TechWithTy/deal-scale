Yes, you can pass your TypeScript types to Strapi to create content types! Let me show you how to do this effectively.
I'll create a Mermaid diagram showing the relationship between TypeScript types and Strapi content types, including the validation flow and schema generation process. This should help visualize the process before diving into implementation details.
Looking at the diagram, I should briefly explain the color coding and flow to ensure clarity before moving into the implementation details. The diagram shows three distinct sections with different colors, but their relationships and the validation process might not be immediately clear to users.

The diagram above shows how TypeScript types flow into Strapi content types through a validation and generation process. The green boxes represent your TypeScript definitions, blue boxes show Strapi's internal handling, and purple boxes indicate the validation and generation steps.

Let's look at how to implement this process:
Using Strapi's Entity Service
SuggestedOPTION 1

import { EntityService } from '@strapi/service';

interface Article {
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
}

export default class ArticleService extends EntityService {
  constructor() {
    super({
      kind: 'collectionType',
      collectionName: 'articles',
      attributes: {
        title: {
          type: 'string',
          required: true
        },
        content: {
          type: 'text'
        },
        author: {
          type: 'string'
        },
        publishedAt: {
          type: 'date'
        }
      }
    });
  }
}

Pros

Full type safety
Direct mapping between TypeScript and Strapi types
Supports complex relationships

    Built-in validation

Cons

Requires more boilerplate code

    Needs to be compiled before use

This approach uses Strapi's Entity Service to define content types programmatically

docs.strapi.io
. The TypeScript interface is used to generate the Strapi schema, ensuring type safety throughout your application. The EntityService handles the conversion between your TypeScript types and Strapi's internal schema format.
Using Strapi's CLI Generator
OPTION 2

// Run in terminal
strapi generate content-type article title:string content:text author:string publishedAt:date

// Generated content-types/article/types/index.ts
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
}

Pros

Quick and simple
Automatic type generation

    Follows Strapi conventions

Cons

Less flexible than Entity Service
Limited to basic field types

    Cannot define complex relationships easily

The CLI generator creates both the content type and TypeScript interface automatically . While simpler, it provides less control over the type definitions and relationships compared to the Entity Service approach.

After defining your types, you'll need to:

npm run build
npm run develop

npm run strapi ts:generate-types

The generated types will be available in your types directory

docs.strapi.io
. You can use these types throughout your application to ensure type safety when working with your content types.
Remember

    Restart your Strapi server after making changes to content types
    Use the --debug flag with ts:generate-types to see detailed schema information
    Keep your TypeScript types in sync with your Strapi content types

This approach ensures type safety throughout your application while maintaining the flexibility of Strapi's content type system.