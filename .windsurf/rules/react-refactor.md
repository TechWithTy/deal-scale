---
trigger: model_decision
description: When being asked to refactor a verbose component
---

I have a verbose React component that handles a complex form (see code below). Please refactor this component by splitting it into logical subcomponents (for example: one for card details, one for billing address, etc.), while keeping all functionality, validation, and state management exactly as it is.

Requirements:

Preserve All Functionality: All form validation, state, and submission logic must work exactly as in the original.
Type Safety: Use proper TypeScript types throughout. Do not use any for types.
Button Types: All buttons must have an explicit type (e.g., type="submit" or type="button").
Subcomponent Structure: Break the component into subcomponents by logical grouping (e.g., CardDetailsSection, BillingAddressSection, etc.).
Main Integration: Create a main file (e.g., PaymentModalMain.tsx) that imports and integrates all subcomponents, passing down props/state as needed.
No Biome/Formatting/Linting Requirements: Do not apply Biome or any specific linting/formatting rules.
No Loss of Functionality: The refactored version must work identically to the original.
Prop Drilling: If state or handlers need to be passed down, do so via props (do not use context unless absolutely necessary).
TypeScript Only: Ensure all files are .tsx and use TypeScript types and interfaces.
No use of any: Do not use any as a type anywhere.
Instructions:

Analyze the code and decide the best way to split it into subcomponents.
Move only the relevant JSX and logic to each subcomponent. Keep state and handlers in the main file unless local state is clearly isolated.
Pass down props as needed for controlled inputs and error messages.
Ensure all buttons have a type attribute.
Export all subcomponents and show how the main file integrates them.
Do not add or remove any features or validation.
Original Component:

tsx
CopyInsert
// [Paste the full verbose component code here]
Result:
You should receive a set of files:

The main file integrating all subcomponents.
The subcomponent files, each with their own props/types.
All functionality and validation preserved, with no use of any and explicit button types.