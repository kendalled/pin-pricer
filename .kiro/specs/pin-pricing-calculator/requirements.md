# Requirements Document

## Introduction

The Lapel Pin & Challenge Coin Pricing Calculator is a modern web application designed to replace manual quote calculations for custom lapel pins and challenge coins. The application will provide an intuitive, step-by-step interface for selecting plating types, sizes, quantities, and modifications to generate accurate pricing quotes in real-time. Built with dark mode design principles and responsive layouts, it will serve as a professional tool for sales teams and customers to quickly generate detailed pricing breakdowns.

## Requirements

### Requirement 1

**User Story:** As a sales representative, I want to select different plating types with their corresponding pricing tables, so that I can provide accurate quotes based on the manufacturing process chosen by the customer.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display five plating type options: Die Struck, Soft Enamel, Silk Screen, Hard Enamel, and Offset Printed
2. WHEN a user selects a plating type THEN the system SHALL display the corresponding pricing table with all size and quantity combinations
3. WHEN Offset Printed is selected THEN the system SHALL indicate a $100 setup fee will be added to the total
4. WHEN switching between plating types THEN the system SHALL update the pricing table immediately without losing other selections

### Requirement 2

**User Story:** As a user, I want to interact with a comprehensive pricing table that shows unit prices for different sizes and quantities, so that I can easily select the appropriate combination for my order.

#### Acceptance Criteria

1. WHEN viewing a pricing table THEN the system SHALL display all six sizes (0.75", 1.00", 1.25", 1.50", 1.75", 2.00") and seven quantities (100, 200, 300, 500, 750, 1000, 2000)
2. WHEN hovering over a table cell THEN the system SHALL provide visual feedback with hover effects
3. WHEN selecting a size/quantity combination THEN the system SHALL highlight the selected cell and update calculations immediately
4. WHEN a selection is made THEN the system SHALL display the unit price and calculate the base total (unit price × quantity)

### Requirement 3

**User Story:** As a customer, I want to customize my order with different backing and packaging options, so that I can get a complete quote that meets my specific needs.

#### Acceptance Criteria

1. WHEN viewing modification options THEN the system SHALL display nine backing options with their respective prices
2. WHEN viewing modification options THEN the system SHALL display five packaging options with their respective prices
3. WHEN free options (Butterfly Clutch, Rubber Clutch, Poly Bag) are displayed THEN the system SHALL show "FREE" instead of $0.00
4. WHEN selecting modifications THEN the system SHALL calculate additional costs per unit and multiply by quantity
5. WHEN rush order is selected THEN the system SHALL add 20% to the total price (base + setup + backing + packaging)

### Requirement 4

**User Story:** As a user, I want to see a detailed price breakdown in real-time, so that I can understand exactly what I'm paying for and make informed decisions.

#### Acceptance Criteria

1. WHEN any selection is made THEN the system SHALL update the price calculation immediately
2. WHEN displaying the breakdown THEN the system SHALL show separate line items for: Base Price, Setup Fee (if applicable), Backing cost, Packaging cost, Rush Fee (if applicable), and Total
3. WHEN Offset Printed is selected THEN the system SHALL display the $100 setup fee as a separate line item
4. WHEN calculations are performed THEN the system SHALL format all prices as currency with two decimal places
5. WHEN the total is calculated THEN the system SHALL display it prominently with larger text and visual emphasis

### Requirement 5

**User Story:** As a user, I want to use the application on different devices with a modern, professional interface, so that I can generate quotes anywhere with an optimal user experience.

#### Acceptance Criteria

1. WHEN accessing the application THEN the system SHALL display a dark mode interface using charcoal/slate backgrounds and light text
2. WHEN using the application on mobile devices THEN the system SHALL provide a responsive layout that works on all screen sizes
3. WHEN interacting with elements THEN the system SHALL provide smooth transitions and clear visual feedback
4. WHEN viewing the interface THEN the system SHALL maintain high contrast for readability and accessibility
5. WHEN using interactive elements THEN the system SHALL provide hover effects and selected state styling

### Requirement 6

**User Story:** As a user, I want to generate and potentially print professional quotes, so that I can provide formal documentation to customers or for record-keeping.

#### Acceptance Criteria

1. WHEN a complete selection is made THEN the system SHALL generate a professional quote summary
2. WHEN viewing the quote THEN the system SHALL include all selected options and their costs in a clear format
3. WHEN printing is needed THEN the system SHALL provide a print-friendly layout
4. WHEN displaying the quote THEN the system SHALL include the calculation breakdown and total prominently

### Requirement 7

**User Story:** As a user, I want the application to validate my inputs and handle errors gracefully, so that I can trust the accuracy of the calculations and have a smooth experience.

#### Acceptance Criteria

1. WHEN invalid data is entered THEN the system SHALL display appropriate error messages
2. WHEN required selections are missing THEN the system SHALL indicate what needs to be completed
3. WHEN calculations are performed THEN the system SHALL ensure mathematical accuracy to two decimal places
4. WHEN errors occur THEN the system SHALL maintain application stability and provide clear guidance to resolve issues